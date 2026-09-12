export function createFrameScheduler(draw: (valid: () => boolean) => Promise<void>, active: () => boolean) {
  let running = false
  let closed = false
  let busy = false
  let pending = false
  let generation = 0
  let frame: number | null = null

  function cancel(): void {
    if (frame !== null)
      cancelAnimationFrame(frame)
    frame = null
  }

  function drain(): void {
    if (busy || closed || !active())
      return
    if (pending) {
      pending = false
      busy = true
      const version = generation
      const valid = () => !closed && active() && generation === version
      const complete = () => {
        busy = false
        drain()
      }
      // An observer throwing must not leave the scheduler busy or reject unhandled.
      void draw(valid).then(complete, complete)
    }
    else if (running && frame === null) {
      frame = requestAnimationFrame(() => {
        frame = null
        pending = true
        drain()
      })
    }
  }

  function request(): void {
    if (closed || !active())
      return
    generation++
    pending = true
    cancel()
    drain()
  }

  function stop(): void {
    running = false
    pending = false
    generation++
    cancel()
  }

  return {
    request,
    start() {
      if (running || closed || !active())
        return
      running = true
      request()
    },
    stop,
    destroy() {
      closed = true
      stop()
    },
  }
}
