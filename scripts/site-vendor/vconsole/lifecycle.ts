interface LogHost {
  ADDED_LOG_PLUGIN_ID: string[]
  flushLogScheduled: boolean
  logQueue: unknown[]
  _flushLogs: () => void
  unmockConsole: () => void
}
interface Frames {
  requestAnimationFrame: (callback: FrameRequestCallback) => number
  cancelAnimationFrame: (id: number) => void
}
const pending: { host: LogHost, id: number }[] = []

interface PanelHost {
  isInited: boolean
  pluginList: Record<string, { id: string }>
}

export function renderTab(host: PanelHost, plugin: { id: string }, render: () => void): void {
  setTimeout(() => {
    if (host.isInited && host.pluginList[plugin.id] === plugin)
      render()
  }, 0)
}

export function enqueue(host: LogHost, log: unknown, frames: Frames): void {
  if (host.ADDED_LOG_PLUGIN_ID.length === 0)
    return
  if (!host.flushLogScheduled) {
    const ticket = { host, id: 0 }
    pending.push(ticket)
    host.flushLogScheduled = true
    ticket.id = frames.requestAnimationFrame(() => {
      const index = pending.indexOf(ticket)
      if (index === -1)
        return
      pending.splice(index, 1)
      host.flushLogScheduled = false
      host._flushLogs()
    })
  }
  host.logQueue.push(log)
}

export function unbind(host: LogHost, frames: Frames): void {
  let ticket
  for (let index = 0; index < pending.length; index++) {
    if (pending[index]!.host === host) {
      ticket = pending[index]
      pending.splice(index, 1)
      break
    }
  }
  host.logQueue = []
  host.flushLogScheduled = false
  try {
    if (ticket && typeof frames.cancelAnimationFrame === 'function')
      frames.cancelAnimationFrame(ticket.id)
  }
  finally {
    host.unmockConsole()
  }
}
