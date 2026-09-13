const cancelled = Symbol('cancelled danmuku frame')

export default class Scheduler {
  constructor(owner) {
    this.owner = owner
    this.generation = 0
    this.starts = 0
    this.frame = null
    this.operation = null
    this.closed = false
    this.running = false
    this.fault = false
    this.failedItems = new Set()
  }

  active(operation) {
    const owner = this.owner
    return !this.closed && !this.fault && !owner.art.isDestroy && !owner.isStop
      && !owner.isHide && operation.generation === this.generation
  }

  release(operation) {
    const { danmu, ref } = operation
    if (ref && danmu.$ref === ref) {
      ref.style.cssText = this.owner.constructor.cssText
      ref.style.visibility = 'hidden'
      this.owner.$refs.push(ref)
      danmu.$ref = null
    }
    operation.ref = null
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
  }

  report(error) {
    try {
      this.owner.art.emit('artplayerPluginDanmuku:error', error)
    }
    catch (listenerError) {
      console.warn('Failed to report danmuku scheduling error:', listenerError)
    }
  }

  fail(error) {
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
    if (!this.running || this.closed || this.fault || owner.art.isDestroy || owner.isStop || this.frame !== null || this.operation)
      return
    this.frame = window.requestAnimationFrame(() => {
      this.frame = null
      owner.timer = null
      if (this.closed || this.fault || owner.isStop || owner.art.isDestroy)
        return
      let cancel
      const cancellation = new Promise(resolve => cancel = () => resolve(cancelled))
      const operation = { generation: this.generation, cancel, wait: value => Promise.race([value, cancellation]), ref: null }
      this.operation = operation
      return this.run(operation).catch((error) => {
        if (this.active(operation))
          this.fail(error)
      }).finally(() => {
        this.release(operation)
        if (this.operation === operation) {
          this.operation = null
          this.schedule()
        }
      })
    })
    owner.timer = this.frame
  }

  async run(operation) {
    const owner = this.owner
    const { setStyles } = owner.utils
    if (!owner.art.playing || !this.active(operation))
      return
    owner.filter('emit', (danmu) => {
      const emitTime = (Date.now() - danmu.$lastStartTime) / 1000
      danmu.$restTime -= emitTime
      danmu.$lastStartTime = Date.now()
      if (danmu.$restTime <= 0)
        owner.makeWait(danmu)
    })
    const readys = owner.readys
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
      const ref = owner.$ref
      operation.danmu = danmu
      operation.ref = ref
      danmu.$ref = ref
      ref.textContent = danmu.text
      owner.$danmuku.appendChild(ref)
      ref.style.opacity = owner.option.opacity
      ref.style.fontSize = `${owner.fontSize}px`
      ref.style.color = danmu.color
      ref.style.border = danmu.border ? `1px solid ${danmu.color}` : null
      ref.style.backgroundColor = danmu.border ? 'rgb(0 0 0 / 50%)' : null
      setStyles(ref, danmu.style)
      if (!this.active(operation))
        return
      danmu.$lastStartTime = Date.now()
      danmu.$restTime = owner.speed
      const distance = clientWidth + ref.clientWidth
      const { result: top } = await operation.wait(owner.postMessage({
        type: 'getDanmuTop',
        target: { mode: danmu.mode, height: ref.clientHeight, speed: distance / danmu.$restTime },
        visibles: owner.visibles,
        antiOverlap: owner.option.antiOverlap,
        clientWidth,
        clientHeight,
        marginBottom: owner.marginBottom,
        marginTop: owner.marginTop,
      }))
      if (!this.active(operation) || danmu.$ref !== ref)
        return
      if (top !== undefined) {
        owner.setState(danmu, 'emit')
        ref.style.top = `${top}px`
        ref.style.visibility = 'visible'
        ref.dataset.mode = danmu.mode
        ref.dataset.id = danmu.id || ''
        switch (danmu.mode) {
          case 0:
            ref.style.left = `${clientWidth}px`
            ref.style.marginLeft = '0px'
            ref.style.transform = `translateX(${-distance}px)`
            ref.style.transition = `transform ${danmu.$restTime}s linear 0s`
            break
          case 1:
          case 2:
            ref.style.left = '50%'
            ref.style.marginLeft = `-${ref.clientWidth / 2}px`
            break
          default:
            break
        }
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
  }
}
