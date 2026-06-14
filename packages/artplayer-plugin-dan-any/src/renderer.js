export const RENDER_MODES = ['Normal', 'Reverse', 'Top', 'Bottom']
export const EMIT_MODES = [...RENDER_MODES, 'Ext']

const DEFAULT_EMITTER_FONT_SIZES = [
  { size: 18, text: '较小' },
  { size: 25, text: '标准' },
  { size: 36, text: '较大' },
]

const DEFAULT_EMITTER_COLORS = [
  '#FE0302',
  '#FF7204',
  '#FFAA02',
  '#FFD302',
  '#FFFF00',
  '#A0EE00',
  '#00CD00',
  '#019899',
  '#4266BE',
  '#89D5FF',
  '#CC0273',
  '#222222',
  '#9B9B9B',
  '#FFFFFF',
].map(color => Number.parseInt(color.replace('#', ''), 16))

const DEFAULT_EMITTER_MODES = [
  { type: 'Normal', text: '滚动' },
  { type: 'Top', text: '顶部' },
  { type: 'Bottom', text: '底部' },
]

const BASE_CSS_TEXT = `
  user-select: none;
  position: absolute;
  white-space: pre;
  pointer-events: none;
  perspective: 500px;
  display: inline-block;
  will-change: transform;
  font-weight: normal;
  line-height: 1.125;
  visibility: hidden;
  font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif;
  text-shadow: rgb(0 0 0) 1px 0 1px, rgb(0 0 0) 0 1px 1px, rgb(0 0 0) 0 -1px 1px, rgb(0 0 0) -1px 0 1px;
`

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getDanmakuTop({ target, visibles, clientWidth, clientHeight, marginBottom, marginTop, antiOverlap }) {
  const maxTop = clientHeight - marginBottom
  const danmakus = visibles
    .filter((item) => {
      if (item.top > maxTop)
        return false

      if (target.mode === 'Normal' || target.mode === 'Reverse')
        return item.mode === 'Normal' || item.mode === 'Reverse'

      return item.mode === target.mode
    })
    .sort((prev, next) => prev.top - next.top)

  if (danmakus.length === 0) {
    if (target.mode === 'Bottom')
      return maxTop - target.height

    return marginTop
  }

  danmakus.unshift({
    type: 'top',
    top: 0,
    left: 0,
    right: 0,
    height: marginTop,
    width: clientWidth,
    speed: 0,
    distance: clientWidth,
  })

  danmakus.push({
    type: 'bottom',
    top: maxTop,
    left: 0,
    right: 0,
    height: marginBottom,
    width: clientWidth,
    speed: 0,
    distance: clientWidth,
  })

  if (target.mode === 'Bottom') {
    for (let index = danmakus.length - 2; index >= 0; index -= 1) {
      const item = danmakus[index]
      const prev = danmakus[index + 1]
      const itemBottom = item.top + item.height
      const diff = prev.top - itemBottom

      if (diff >= target.height)
        return prev.top - target.height
    }
  }
  else {
    for (let index = 1; index < danmakus.length; index += 1) {
      const item = danmakus[index]
      const prev = danmakus[index - 1]
      const prevBottom = prev.top + prev.height
      const diff = item.top - prevBottom

      if (diff >= target.height)
        return prevBottom
    }
  }

  const topMap = []
  for (let index = 1; index < danmakus.length - 1; index += 1) {
    const item = danmakus[index]
    const last = topMap[topMap.length - 1]

    if (last && last[0].top === item.top) {
      last.push(item)
    }
    else {
      topMap.push([item])
    }
  }

  if (antiOverlap) {
    if (target.mode === 'Normal' || target.mode === 'Reverse') {
      const result = topMap.find((list) => {
        return list.every((danmaku) => {
          if (danmaku.mode !== target.mode)
            return false
          if (clientWidth < danmaku.distance)
            return false
          if (target.speed < danmaku.speed)
            return true

          const overlapTime = danmaku.right / (target.speed - danmaku.speed)
          return overlapTime > danmaku.time
        })
      })

      return result && result[0] ? result[0].top : undefined
    }

    return undefined
  }

  if (target.mode === 'Normal' || target.mode === 'Reverse') {
    topMap.sort((prev, next) => {
      const nextMinRight = Math.min(...next.map(item => item.right))
      const prevMinRight = Math.min(...prev.map(item => item.right))
      return nextMinRight * next.length - prevMinRight * prev.length
    })
  }
  else {
    topMap.sort((prev, next) => {
      const nextMaxWidth = Math.max(...next.map(item => item.width))
      const prevMaxWidth = Math.max(...prev.map(item => item.width))
      return prevMaxWidth * prev.length - nextMaxWidth * next.length
    })
  }

  return topMap[0]?.[0]?.top
}

function normalizeModes(modes) {
  if (!Array.isArray(modes))
    return [...RENDER_MODES]

  return modes.filter(mode => RENDER_MODES.includes(mode))
}

function normalizeEmitterFontSizes(fontSizes) {
  const result = Array.isArray(fontSizes)
    ? fontSizes
        .map((item) => {
          const size = Number(item?.size)

          if (!Number.isFinite(size))
            return null

          return {
            size: clamp(Math.round(size), 1, 200),
            text: typeof item.text === 'string' ? item.text : undefined,
          }
        })
        .filter(Boolean)
    : []

  return result.length ? result : DEFAULT_EMITTER_FONT_SIZES.map(item => ({ ...item }))
}

function normalizeEmitterColors(colors) {
  const result = Array.isArray(colors)
    ? colors
        .map((color) => {
          const value = Number(color)

          if (!Number.isFinite(value))
            return null

          return clamp(Math.round(value), 0, 0xFFFFFF)
        })
        .filter(color => color !== null)
    : []

  return result.length ? result : [...DEFAULT_EMITTER_COLORS]
}

function normalizeEmitterModes(modes) {
  const result = Array.isArray(modes)
    ? modes
        .map((item) => {
          const type = item?.type

          if (!EMIT_MODES.includes(type))
            return null

          return {
            type,
            text: typeof item.text === 'string' ? item.text : undefined,
          }
        })
        .filter(Boolean)
    : []

  return result.length ? result : DEFAULT_EMITTER_MODES.map(item => ({ ...item }))
}

function normalizeColorNumber(color) {
  return `#${clamp(Math.round(color), 0, 0xFFFFFF).toString(16).padStart(6, '0')}`
}

function normalizeColor(color) {
  if (typeof color === 'number' && Number.isFinite(color)) {
    return normalizeColorNumber(color)
  }

  if (typeof color === 'string') {
    const value = color.trim()
    const number = Number(value)

    if (!value)
      return '#ffffff'

    if (/^(?:\d+|0x[\da-f]+)$/i.test(value) && Number.isFinite(number))
      return normalizeColorNumber(number)

    return value
  }

  return '#ffffff'
}

function compareDanmaku(prev, next) {
  const diff = prev.progress - next.progress

  if (diff)
    return diff

  return String(prev.DMID || '').localeCompare(String(next.DMID || ''))
}

export function normalizeRendererOption(option = {}) {
  const normalized = {
    danmuku: [],
    speed: 5,
    margin: [10, '25%'],
    opacity: 1,
    color: '#ffffff',
    modes: [...RENDER_MODES],
    fontSize: 'source',
    antiOverlap: true,
    synchronousPlayback: false,
    visible: true,
    emitter: true,
    emitDefaults: {},
    emitterFontSizes: DEFAULT_EMITTER_FONT_SIZES,
    emitterColors: DEFAULT_EMITTER_COLORS,
    emitterModes: DEFAULT_EMITTER_MODES,
    heatmap: false,
    points: [],
    plugins: [],
    maxLength: 200,
    lockTime: 5,
    width: 512,
    filter: () => true,
    beforeEmit: () => true,
    emit: () => true,
    beforeVisible: () => true,
    ...option,
  }

  normalized.speed = clamp(Number(normalized.speed) || 5, 1, 10)
  normalized.opacity = clamp(Number(normalized.opacity) || 0, 0, 1)
  normalized.maxLength = clamp(Number(normalized.maxLength) || 200, 1, 1000)
  normalized.lockTime = clamp(Number(normalized.lockTime) || 5, 1, 60)
  normalized.margin = Array.isArray(normalized.margin) ? normalized.margin : [10, '25%']
  normalized.modes = normalizeModes(normalized.modes)
  normalized.emitDefaults = normalized.emitDefaults && typeof normalized.emitDefaults === 'object'
    ? { ...normalized.emitDefaults }
    : {}
  normalized.emitterFontSizes = normalizeEmitterFontSizes(normalized.emitterFontSizes)
  normalized.emitterColors = normalizeEmitterColors(normalized.emitterColors)
  normalized.emitterModes = normalizeEmitterModes(normalized.emitterModes)
  normalized.plugins = Array.isArray(normalized.plugins)
    ? normalized.plugins.filter(plugin => typeof plugin === 'function')
    : []
  normalized.heatmap = normalized.heatmap && typeof normalized.heatmap === 'object'
    ? { ...normalized.heatmap }
    : !!normalized.heatmap
  normalized.points = Array.isArray(normalized.points) ? [...normalized.points] : []
  normalized.filter = typeof normalized.filter === 'function' ? normalized.filter : () => true
  normalized.beforeEmit = typeof normalized.beforeEmit === 'function' ? normalized.beforeEmit : () => true
  normalized.emit = typeof normalized.emit === 'function' ? normalized.emit : () => true
  normalized.beforeVisible = typeof normalized.beforeVisible === 'function' ? normalized.beforeVisible : () => true

  return normalized
}

export default class DanAnyDomRenderer {
  constructor(art, option = {}) {
    const { template } = art

    this.art = art
    this.$danmuku = template.$danmuku
    this.$player = template.$player
    this.queue = []
    this.udanmakus = []
    this.$refs = []
    this.states = { wait: [], ready: [], emit: [], stop: [] }
    this.stateMap = new WeakMap()
    this.timer = null
    this.index = 0
    this.isStop = true
    this.isHide = false
    this.destroyed = false
    this.option = normalizeRendererOption(option)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.reset = this.reset.bind(this)
    this.resize = this.resize.bind(this)
    this.destroy = this.destroy.bind(this)

    art.on('video:play', this.start)
    art.on('video:playing', this.start)
    art.on('video:pause', this.stop)
    art.on('video:waiting', this.stop)
    art.on('video:seeking', this.reset)
    art.on('restart', this.reset)
    art.on('resize', this.resize)
    art.on('destroy', this.destroy)

    if (this.option.visible)
      this.show()
    else
      this.hide()
  }

  get speed() {
    return this.option.synchronousPlayback && this.art.playbackRate
      ? this.option.speed / Number(this.art.playbackRate)
      : this.option.speed
  }

  get marginTop() {
    const value = this.option.margin[0]
    const { clientHeight } = this.$player

    if (typeof value === 'number')
      return clamp(value, 0, clientHeight)

    if (typeof value === 'string' && value.endsWith('%'))
      return clamp(clientHeight * Number.parseFloat(value) / 100, 0, clientHeight)

    return 10
  }

  get marginBottom() {
    const value = this.option.margin[1]
    const { clientHeight } = this.$player

    if (typeof value === 'number')
      return clamp(value, 0, clientHeight)

    if (typeof value === 'string' && value.endsWith('%'))
      return clamp(clientHeight * Number.parseFloat(value) / 100, 0, clientHeight)

    return clientHeight * 0.25
  }

  get $ref() {
    const $ref = this.$refs.pop() || document.createElement('div')
    this.resetRef($ref)
    return $ref
  }

  get readys() {
    const current = this.art.currentTime * 1000
    const result = []

    this.filter('ready', danmaku => result.push(danmaku))
    this.filter('wait', (danmaku) => {
      if (current + 100 >= danmaku.progress && danmaku.progress >= current - 100)
        result.push(danmaku)
    })

    return result
  }

  get visibles() {
    const result = []
    const { clientWidth } = this.$player
    const clientLeft = this.getLeft(this.$player)

    this.filter('emit', (danmaku) => {
      const state = this.getState(danmaku)
      const $ref = state.$ref

      if (!$ref)
        return

      const actualLeft = this.getLeft($ref) - clientLeft
      const width = $ref.clientWidth
      const left = danmaku.mode === 'Reverse'
        ? clientWidth - actualLeft - width
        : actualLeft
      const distance = left + width
      const right = clientWidth - distance

      result.push({
        top: $ref.offsetTop,
        left,
        height: $ref.clientHeight,
        width,
        right,
        speed: distance / state.restTime,
        distance,
        time: state.restTime,
        mode: danmaku.mode,
      })
    })

    return result
  }

  getLeft($ref) {
    return $ref.getBoundingClientRect().left
  }

  getFontSize(danmaku) {
    const value = this.option.fontSize
    const { clientHeight } = this.$player

    if (typeof value === 'number')
      return Math.round(clamp(value, 12, clientHeight))

    if (typeof value === 'string' && value.endsWith('%'))
      return Math.round(clamp(clientHeight * Number.parseFloat(value) / 100, 12, clientHeight))

    return Math.round(clamp(Number(danmaku.fontsize) || 25, 12, clientHeight || 25))
  }

  getState(danmaku) {
    let state = this.stateMap.get(danmaku)

    if (!state) {
      state = {
        status: 'wait',
        index: this.index++,
        $ref: null,
        restTime: 0,
        lastStartTime: 0,
      }
      this.stateMap.set(danmaku, state)
    }

    return state
  }

  resetRef($ref) {
    $ref.style.cssText = BASE_CSS_TEXT
    $ref.className = 'apda-danmaku'
    $ref.dataset.mode = ''
    $ref.dataset.state = ''
    $ref.dataset.id = ''
    $ref.textContent = ''
  }

  setState(danmaku, status) {
    const state = this.getState(danmaku)
    const oldList = this.states[state.status]

    if (oldList)
      this.states[state.status] = oldList.filter(item => item !== danmaku)

    state.status = status

    if (state.$ref)
      state.$ref.dataset.state = status

    this.states[status].push(danmaku)
  }

  filter(status, callback) {
    const danmakus = this.states[status] || []

    for (let index = 0; index < danmakus.length; index++) {
      callback(danmakus[index])
    }

    return danmakus
  }

  recycle(danmaku, status = 'wait') {
    const state = this.getState(danmaku)

    this.setState(danmaku, status)

    if (state.$ref) {
      this.resetRef(state.$ref)
      this.$refs.push(state.$ref)
      state.$ref = null
    }
  }

  clear() {
    window.cancelAnimationFrame(this.timer)
    this.timer = null
    this.queue.forEach(danmaku => this.recycle(danmaku))
    this.queue = []
    this.udanmakus = []
    this.$refs = []
    this.states = { wait: [], ready: [], emit: [], stop: [] }
    this.stateMap = new WeakMap()
    this.$danmuku.textContent = ''
  }

  load(udanmakus = []) {
    this.clear()
    this.queue = udanmakus
      .filter(danmaku => RENDER_MODES.includes(danmaku.mode))
      .filter(danmaku => typeof danmaku.content === 'string' && danmaku.content.trim())
      .filter(danmaku => this.option.filter(danmaku))
      .sort(compareDanmaku)
    this.udanmakus = this.queue

    this.queue.forEach(danmaku => this.setState(danmaku, 'wait'))

    if (this.art.playing && !this.isHide)
      this.start()

    return this
  }

  emit(danmaku) {
    if (!RENDER_MODES.includes(danmaku?.mode))
      return false

    if (typeof danmaku.content !== 'string' || !danmaku.content.trim())
      return false

    this.queue.push(danmaku)
    this.queue.sort(compareDanmaku)
    this.udanmakus = this.queue
    this.setState(danmaku, 'wait')

    if (this.art.playing && !this.isHide && this.isStop)
      this.start()

    return true
  }

  config(option = {}, isInit = false) {
    const shouldReset = !isInit && ['fontSize', 'margin', 'modes', 'speed', 'synchronousPlayback'].some(
      key => Object.prototype.hasOwnProperty.call(option, key),
    )

    this.option = normalizeRendererOption({
      ...this.option,
      ...option,
    })

    if (this.option.visible)
      this.show()
    else
      this.hide()

    if (shouldReset)
      this.reset()

    this.art.emit('artplayerPluginDanAny:config', this.option)

    return this
  }

  async showDanmaku(danmaku) {
    if (!this.option.modes.includes(danmaku.mode))
      return

    const visible = await this.option.beforeVisible(danmaku)
    if (!visible)
      return

    const { clientWidth, clientHeight } = this.$player
    const state = this.getState(danmaku)
    const $ref = this.$ref

    state.$ref = $ref
    $ref.textContent = danmaku.content
    $ref.dataset.mode = danmaku.mode
    $ref.dataset.id = danmaku.DMID || ''
    $ref.style.opacity = this.option.opacity
    $ref.style.fontSize = `${this.getFontSize(danmaku)}px`
    $ref.style.color = normalizeColor(danmaku.color ?? this.option.color)

    this.$danmuku.appendChild($ref)

    const width = $ref.clientWidth
    const height = $ref.clientHeight
    const distance = clientWidth + width
    const restTime = this.speed
    const top = getDanmakuTop({
      target: {
        mode: danmaku.mode,
        height,
        width,
        speed: distance / restTime,
      },
      visibles: this.visibles,
      antiOverlap: this.option.antiOverlap,
      clientWidth,
      clientHeight,
      marginBottom: this.marginBottom,
      marginTop: this.marginTop,
    })

    if (this.isStop || top === undefined) {
      this.recycle(danmaku, 'ready')
      return
    }

    state.restTime = restTime
    state.lastStartTime = Date.now()
    this.setState(danmaku, 'emit')

    $ref.style.top = `${top}px`
    $ref.style.visibility = 'visible'

    switch (danmaku.mode) {
      case 'Normal':
        $ref.style.left = `${clientWidth}px`
        $ref.style.transform = `translateX(${-distance}px)`
        $ref.style.transition = `transform ${state.restTime}s linear 0s`
        break
      case 'Reverse':
        $ref.style.left = `${-width}px`
        $ref.style.transform = `translateX(${distance}px)`
        $ref.style.transition = `transform ${state.restTime}s linear 0s`
        break
      case 'Top':
      case 'Bottom':
        $ref.style.left = '50%'
        $ref.style.marginLeft = `${-width / 2}px`
        $ref.style.transition = 'transform 0s linear 0s'
        break
      default:
        break
    }

    this.art.emit('artplayerPluginDanAny:visible', danmaku)
  }

  updateRestTimes() {
    this.filter('emit', (danmaku) => {
      const state = this.getState(danmaku)
      const emitTime = (Date.now() - state.lastStartTime) / 1000
      state.restTime -= emitTime
      state.lastStartTime = Date.now()

      if (state.restTime <= 0)
        this.recycle(danmaku)
    })
  }

  update() {
    window.cancelAnimationFrame(this.timer)
    this.timer = window.requestAnimationFrame(async () => {
      if (this.art.playing && !this.isHide) {
        this.updateRestTimes()

        const readys = this.readys
        for (let index = 0; index < readys.length; index++) {
          await this.showDanmaku(readys[index])
        }
      }

      if (!this.isStop)
        this.update()
    })

    return this
  }

  reset() {
    this.queue.forEach(danmaku => this.recycle(danmaku))
    this.art.emit('artplayerPluginDanAny:reset')
    return this
  }

  resize() {
    this.reset()
    this.art.emit('artplayerPluginDanAny:resize')
    return this
  }

  continue() {
    const { clientWidth } = this.$player

    this.filter('stop', (danmaku) => {
      const state = this.getState(danmaku)
      const $ref = state.$ref

      if (!$ref)
        return

      this.setState(danmaku, 'emit')
      state.lastStartTime = Date.now()

      if (danmaku.mode === 'Normal') {
        const left = this.getLeft($ref) - this.getLeft(this.$player)
        const distance = left + $ref.clientWidth
        $ref.style.transform = `translateX(${-distance}px)`
        $ref.style.transition = `transform ${state.restTime}s linear 0s`
      }
      else if (danmaku.mode === 'Reverse') {
        const left = this.getLeft($ref) - this.getLeft(this.$player)
        const distance = clientWidth - left
        $ref.style.transform = `translateX(${distance}px)`
        $ref.style.transition = `transform ${state.restTime}s linear 0s`
      }
    })

    return this
  }

  suspend() {
    this.updateRestTimes()

    this.filter('emit', (danmaku) => {
      const state = this.getState(danmaku)
      const $ref = state.$ref

      if (!$ref)
        return

      this.setState(danmaku, 'stop')

      if (danmaku.mode === 'Normal' || danmaku.mode === 'Reverse') {
        const left = this.getLeft($ref) - this.getLeft(this.$player)
        $ref.style.left = `${left}px`
        $ref.style.transform = 'translateX(0px)'
        $ref.style.transition = 'transform 0s linear 0s'
      }
    })

    return this
  }

  stop() {
    this.isStop = true
    this.suspend()
    window.cancelAnimationFrame(this.timer)
    this.art.emit('artplayerPluginDanAny:stop')
    return this
  }

  start() {
    if (!this.isStop)
      return this

    this.isStop = false
    this.continue()
    this.update()
    this.art.emit('artplayerPluginDanAny:start')
    return this
  }

  show() {
    this.isHide = false
    this.option.visible = true
    this.$danmuku.style.opacity = 1
    this.art.emit('artplayerPluginDanAny:show')
    return this
  }

  hide() {
    this.isHide = true
    this.option.visible = false
    this.$danmuku.style.opacity = 0
    this.art.emit('artplayerPluginDanAny:hide')
    return this
  }

  destroy() {
    if (this.destroyed)
      return

    this.destroyed = true
    this.stop()
    this.clear()

    this.art.off('video:play', this.start)
    this.art.off('video:playing', this.start)
    this.art.off('video:pause', this.stop)
    this.art.off('video:waiting', this.stop)
    this.art.off('video:seeking', this.reset)
    this.art.off('restart', this.reset)
    this.art.off('resize', this.resize)
    this.art.off('destroy', this.destroy)
    this.art.emit('artplayerPluginDanAny:destroy')
  }
}
