import type Danmuku from './danmuku'
import type { DanmuItem } from './types'
import type { PlacementRequest } from './worker-types'
import { getDanmuTop } from './placement'
import SamplingWindow from './sampling-window'
import SchedulingBuffer from './scheduling-buffer'

const cancelled = Symbol('cancelled danmuku frame')

export interface FrameOperation {
  generation: number
  cancel: () => void
  wait: <T>(value: T | PromiseLike<T>) => Promise<T | typeof cancelled>
  danmu?: DanmuItem
  ref: HTMLDivElement | null
}

export default class Scheduler {
  declare owner: Danmuku
  declare generation: number
  declare starts: number
  declare frame: number | null
  declare operation: FrameOperation | null
  declare closed: boolean
  declare running: boolean
  declare fault: boolean
  declare failedItems: Set<DanmuItem>
  declare buffer: SchedulingBuffer
  declare sampling: SamplingWindow

  constructor(owner: Danmuku) {
    this.owner = owner
    this.generation = 0
    this.starts = 0
    this.frame = null
    this.operation = null
    this.closed = false
    this.running = false
    this.fault = false
    this.failedItems = new Set()
    this.buffer = new SchedulingBuffer()
    this.sampling = new SamplingWindow()
  }

  active(operation: FrameOperation) {
    const owner = this.owner
    return !this.closed && !this.fault && !owner.art.isDestroy && !owner.isStop
      && !owner.isHide && operation.generation === this.generation
  }

  release(operation: FrameOperation) {
    this.owner.renderer.release(operation)
  }

  invalidate() {
    this.generation++
    if (this.frame !== null)
      window.cancelAnimationFrame(this.frame)
    this.frame = null
    this.owner.timer = null
    if (this.operation) {
      const operation = this.operation
      this.operation = null
      operation.cancel()
      this.release(operation)
    }
    this.owner.workerClient?.cancel()
    this.failedItems.clear()
    this.buffer.clear()
    this.sampling.clear()
  }

  report(error: unknown) {
    try {
      this.owner.art.emit('artplayerPluginDanmuku:error', error)
    }
    catch (listenerError) {
      console.warn('Failed to report danmuku scheduling error:', listenerError)
    }
  }

  fail(error: unknown) {
    if (this.closed || this.fault)
      return
    this.fault = true
    this.invalidate()
    this.report(error)
  }

  recover() {
    if (this.closed || this.owner.art.isDestroy)
      return
    this.failedItems.clear()
    if (this.fault) {
      try {
        this.owner.workerClient?.dispose()
        this.owner.createWorker()
        this.fault = false
      }
      catch (error) {
        this.report(error)
      }
    }
  }

  schedule() {
    const owner = this.owner
    if (!this.running || this.closed || this.fault || owner.art.isDestroy || owner.isStop || this.frame !== null)
      return
    this.frame = window.requestAnimationFrame(() => {
      this.frame = null
      owner.timer = null
      if (this.closed || this.fault || owner.isStop || owner.art.isDestroy)
        return
      const generation = this.generation
      try {
        if (owner.art.playing && !owner.isHide) {
          owner.filter('emit', (danmu) => {
            const now = Date.now()
            danmu.$restTime -= (now - danmu.$lastStartTime) / 1000
            danmu.$lastStartTime = now
            if (danmu.$restTime <= 0)
              owner.makeWait(danmu)
          })
          const time = owner.art.currentTime
          const readys = owner.readys
          if (generation !== this.generation)
            return
          this.buffer.capture(this.sampling.capture(owner, readys, time), this.failedItems)
        }
      }
      catch (error) {
        if (generation === this.generation)
          this.fail(error)
        return
      }
      this.schedule()
      if (this.operation || !owner.art.playing || owner.isHide)
        return
      const readys = this.buffer.take()
      if (!readys.length)
        return
      let cancel!: () => void
      const cancellation = new Promise<typeof cancelled>(resolve => cancel = () => resolve(cancelled))
      const operation: FrameOperation = { generation: this.generation, cancel, wait: value => Promise.race([value, cancellation]), ref: null }
      this.operation = operation
      return this.run(operation, readys).catch((error) => {
        if (this.active(operation))
          this.fail(error)
      }).finally(() => {
        this.release(operation)
        if (this.operation === operation) {
          this.operation = null
          this.buffer.complete()
        }
      })
    })
    owner.timer = this.frame
  }

  async run(operation: FrameOperation, readys: DanmuItem[]) {
    const owner = this.owner
    if (!owner.art.playing || !this.active(operation))
      return
    for (const danmu of readys) {
      if (!this.active(operation))
        return
      if (this.failedItems.has(danmu))
        continue
      let state
      try {
        state = await operation.wait(owner.option.beforeVisible(danmu))
      }
      catch (error) {
        if (!this.active(operation))
          return
        this.failedItems.add(danmu)
        this.report(error)
        continue
      }
      if (!this.active(operation))
        return
      if (!state)
        continue

      const { clientWidth, clientHeight } = owner.$player
      const ref = owner.renderer.prepare(danmu, operation)
      if (!this.active(operation))
        return
      danmu.$lastStartTime = Date.now()
      danmu.$restTime = owner.speed
      const distance = clientWidth + ref.clientWidth
      const request: PlacementRequest = {
        type: 'getDanmuTop',
        target: { mode: danmu.mode, height: ref.clientHeight, speed: distance / danmu.$restTime },
        visibles: owner.visibles,
        antiOverlap: owner.option.antiOverlap,
        clientWidth,
        clientHeight,
        // Valid margins are numeric. Preserve the old raw fallback for unsupported strings.
        marginBottom: owner.marginBottom as number,
        marginTop: owner.marginTop,
      }
      // Relaxed placement is small and deterministic; avoid a Worker round trip per row.
      // Collision-sensitive placement and the internal postMessage API still use the Worker.
      const reply = request.antiOverlap
        ? await operation.wait(owner.postMessage(request))
        : { result: getDanmuTop(request) }
      const top = typeof reply === 'symbol' ? undefined : reply.result
      if (!this.active(operation) || danmu.$ref !== ref)
        return
      if (top !== undefined) {
        // The hidden Worker wait must not consume the CSS-visible lifetime.
        danmu.$lastStartTime = Date.now()
        owner.setState(danmu, 'emit')
        owner.renderer.place(danmu, ref, top, distance, clientWidth)
        operation.ref = null
        owner.art.emit('artplayerPluginDanmuku:visible', danmu)
      }
      else {
        owner.setState(danmu, 'ready')
        this.release(operation)
      }
    }
  }

  destroy() {
    this.closed = true
    this.invalidate()
    this.sampling.destroy()
  }
}
