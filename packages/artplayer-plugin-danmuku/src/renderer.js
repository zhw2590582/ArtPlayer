export default class Renderer {
  constructor(owner) {
    this.owner = owner
    this.nodes = new Set()
  }

  acquire() {
    const $ref = this.owner.$refs.pop() || document.createElement('div')
    $ref.style.cssText = this.owner.constructor.cssText
    $ref.dataset.mode = ''
    $ref.dataset.id = ''
    $ref.className = ''
    this.nodes.add($ref)
    return $ref
  }

  get visibles() {
    const result = []
    const { clientWidth } = this.owner.$player
    const clientLeft = this.owner.getLeft(this.owner.$player)

    this.owner.filter('emit', (danmu) => {
      const top = danmu.$ref.offsetTop
      const left = this.owner.getLeft(danmu.$ref) - clientLeft
      const height = danmu.$ref.clientHeight
      const width = danmu.$ref.clientWidth
      const distance = left + width
      const right = clientWidth - distance
      const speed = distance / danmu.$restTime

      const emit = {}
      emit.top = top
      emit.left = left
      emit.height = height
      emit.width = width
      emit.right = right
      emit.speed = speed
      emit.distance = distance
      emit.time = danmu.$restTime
      emit.mode = danmu.mode

      result.push(emit)
    })

    return result
  }

  left($ref) {
    const rect = $ref.getBoundingClientRect()
    return this.owner.isRotate ? rect.top : rect.left
  }

  makeWait(danmu) {
    this.owner.setState(danmu, 'wait')
    if (danmu.$ref) {
      danmu.$ref.style.cssText = this.owner.constructor.cssText
      danmu.$ref.style.visibility = 'hidden'
      danmu.$ref.style.marginLeft = '0px'
      danmu.$ref.style.transform = 'translateX(0px)'
      danmu.$ref.style.transition = 'transform 0s linear 0s'
      this.owner.$refs.push(danmu.$ref)
      danmu.$ref = null
    }
  }

  resize() {
    const { clientWidth } = this.owner.$player

    this.owner.filter('stop', (danmu) => {
      switch (danmu.mode) {
        // 滚动的弹幕
        case 0:
          danmu.$ref.style.left = `${clientWidth}px`
          break
        default:
          break
      }
    })

    this.owner.filter('emit', (danmu) => {
      danmu.$lastStartTime = Date.now()
      switch (danmu.mode) {
        // 滚动的弹幕
        case 0: {
          const distance = clientWidth + danmu.$ref.clientWidth
          danmu.$ref.style.left = `${clientWidth}px`
          danmu.$ref.style.transform = `translateX(${-distance}px)`
          danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`
          break
        }
        default:
          break
      }
    })
  }

  continue() {
    const { clientWidth } = this.owner.$player
    this.owner.filter('stop', (danmu) => {
      this.owner.setState(danmu, 'emit') // 转换为emit状态
      danmu.$lastStartTime = Date.now()
      switch (danmu.mode) {
        // 继续滚动的弹幕
        case 0: {
          const distance = clientWidth + danmu.$ref.clientWidth
          danmu.$ref.style.transform = `translateX(${-distance}px)`
          danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`
          break
        }
        default:
          break
      }
    })

    return this
  }

  suspend() {
    const { clientWidth } = this.owner.$player
    this.owner.filter('emit', (danmu) => {
      this.owner.setState(danmu, 'stop') // 转换为stop状态
      switch (danmu.mode) {
        // 停止滚动的弹幕
        case 0: {
          const translateX = clientWidth - (this.owner.getLeft(danmu.$ref) - this.owner.getLeft(this.owner.$player))
          danmu.$ref.style.transform = `translateX(${-translateX}px)`
          danmu.$ref.style.transition = 'transform 0s linear 0s'
          break
        }
        default:
          break
      }
    })

    return this
  }

  prepare(danmu, operation) {
    const owner = this.owner
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
    owner.utils.setStyles(ref, danmu.style)
    return ref
  }

  place(danmu, ref, top, distance, clientWidth) {
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

  clear() {
    this.destroy()
    this.owner.$refs = []
    this.owner.$danmuku.textContent = ''
  }

  destroy() {
    for (const node of this.nodes) {
      if (node.parentElement)
        node.parentElement.removeChild(node)
    }
    for (const danmu of this.owner.queue) danmu.$ref = null
    this.owner.$refs.length = 0
    this.nodes.clear()
  }
}
