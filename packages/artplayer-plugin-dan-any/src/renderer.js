export const RENDER_MODES = ['Normal', 'Reverse', 'Top', 'Bottom', 'Ext']
export const EMIT_MODES = [...RENDER_MODES]

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
  pointer-events: auto;
  cursor: pointer;
  perspective: 500px;
  display: inline-block;
  will-change: transform;
  font-weight: normal;
  line-height: 1.125;
  visibility: hidden;
  font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif;
  text-shadow: rgb(0 0 0) 1px 0 1px, rgb(0 0 0) 0 1px 1px, rgb(0 0 0) 0 -1px 1px, rgb(0 0 0) -1px 0 1px;
`

const MERGE_COUNT_CSS_TEXT = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin-left: 0.35em;
  padding: 0.02em 0.32em 0.04em;
  border-radius: 0.3em;
  color: #fff;
  background: rgba(0, 161, 214, 0.88);
  font-size: 0.78em;
  font-weight: bold;
  line-height: 1;
  text-shadow: none;
`

const MERGE_COUNT_ANIMATION_DURATION = 600
const MERGE_FONT_MIN_SIZE = 12
const MERGE_FONT_MAX_SIZE = 42
const MERGE_MAX_WIDTH_RATIO = 0.9

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

function getDanmakuMerge(danmaku) {
  const merge = danmaku?.extra?.danuni?.merge

  return merge && typeof merge === 'object' ? merge : null
}

function isRenderableDanmaku(danmaku) {
  return RENDER_MODES.includes(danmaku?.mode) || !!getDanmakuMerge(danmaku)
}

function getMergeRestTime(merge, speed) {
  const duration = Number(merge.duration)

  return Number.isFinite(duration) && duration > 0 ? duration / 1000 : speed
}

function getMergeCount(count) {
  const value = Number(count)

  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0
}

function getMergeCountText(danmaku, count) {
  return `${danmaku.content} x${count}`
}

function setMergeCountText($count, count) {
  if ($count)
    $count.textContent = `x${count}`
}

function setMergeDanmakuContent($ref, danmaku, count) {
  const $content = document.createElement('span')
  const $count = document.createElement('span')

  $content.className = 'apda-danmaku-content'
  $content.textContent = danmaku.content
  $count.className = 'apda-danmaku-count'
  $count.style.cssText = MERGE_COUNT_CSS_TEXT
  setMergeCountText($count, count)

  $ref.textContent = ''
  $ref.appendChild($content)
  $ref.appendChild($count)

  return $count
}

function reserveMergeCountWidth($count) {
  if ($count)
    $count.style.minWidth = `${$count.clientWidth}px`
}

function getTextLength(text) {
  return Array.from(String(text)).reduce((total, char) => {
    const code = char.codePointAt(0) || 0

    if (code <= 0x007F)
      return total + 0.55

    if (code <= 0x00FF)
      return total + 0.7

    return total + 1
  }, 0)
}

function getMergeMaxWidth(clientWidth) {
  const width = Number(clientWidth) || 0

  return Math.max(MERGE_FONT_MIN_SIZE * 6, width * MERGE_MAX_WIDTH_RATIO)
}

function getMergeFontSize(text, clientWidth, clientHeight) {
  const width = Number(clientWidth) || 0
  const height = Number(clientHeight) || 0
  const maxByPlayer = Math.min(height * 0.08, width * 0.055, MERGE_FONT_MAX_SIZE)
  const maxFontSize = Math.max(MERGE_FONT_MIN_SIZE, Math.min(maxByPlayer, height || MERGE_FONT_MAX_SIZE))
  const maxByLength = getMergeMaxWidth(width) / Math.max(1, getTextLength(text))

  return Math.round(clamp(Math.min(maxFontSize, maxByLength), MERGE_FONT_MIN_SIZE, maxFontSize))
}

function fitMergeFontSize($ref, fontSize, maxWidth) {
  const width = $ref.clientWidth

  if (width <= maxWidth)
    return width

  const nextFontSize = Math.max(MERGE_FONT_MIN_SIZE, Math.floor(fontSize * maxWidth / width))

  if (nextFontSize >= fontSize)
    return width

  $ref.style.fontSize = `${nextFontSize}px`

  return $ref.clientWidth
}

function getMergeCountAnimationDuration(restTime) {
  const restDuration = restTime * 1000

  return Number.isFinite(restDuration) && restDuration > 0
    ? Math.min(MERGE_COUNT_ANIMATION_DURATION, restDuration)
    : MERGE_COUNT_ANIMATION_DURATION
}

function getEaseOutCubic(progress) {
  return 1 - (1 - progress) ** 3
}

function getMergeDanmakuTop({ height, visibles, clientHeight }) {
  if (height > clientHeight)
    return undefined

  const danmakus = visibles
    .filter(item => item.top < clientHeight)
    .sort((prev, next) => prev.top - next.top)

  let top = 0
  for (let index = 0; index < danmakus.length; index += 1) {
    const item = danmakus[index]

    if (item.top - top >= height)
      return top

    top = Math.max(top, item.top + item.height)
  }

  return clientHeight - top >= height ? top : undefined
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

function normalizeTypeOptions(typeOptions) {
  if (!typeOptions || typeof typeOptions !== 'object')
    return { color: true, count: true }

  return {
    color: typeOptions.color !== false,
    count: typeOptions.count !== false,
  }
}

function compareDanmaku(prev, next) {
  const diff = prev.progress - next.progress

  if (diff)
    return diff

  return String(prev.DMID || '').localeCompare(String(next.DMID || ''))
}

function getDanmakuColor(danmaku, typeOptions, defaultColor) {
  if (typeOptions.color && danmaku.color != null)
    return normalizeColor(danmaku.color)

  return normalizeColor(defaultColor)
}

export function normalizeRendererOption(option = {}) {
  const normalized = {
    danmuku: [],
    speed: 5,
    margin: [10, '25%'],
    opacity: 1,
    color: '#ffffff',
    modes: [...RENDER_MODES],
    typeOptions: { color: true, count: true },
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
    onLike: undefined,
    onReport: undefined,
    enableInteraction: true,
    ...option,
  }

  normalized.speed = clamp(Number(normalized.speed) || 5, 1, 10)
  normalized.opacity = clamp(Number(normalized.opacity) || 0, 0, 1)
  normalized.maxLength = clamp(Number(normalized.maxLength) || 200, 1, 1000)
  normalized.lockTime = clamp(Number(normalized.lockTime) || 5, 1, 60)
  normalized.margin = Array.isArray(normalized.margin) ? normalized.margin : [10, '25%']
  normalized.modes = normalizeModes(normalized.modes)
  normalized.typeOptions = normalizeTypeOptions(normalized.typeOptions)
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
  normalized.onLike = typeof normalized.onLike === 'function' ? normalized.onLike : undefined
  normalized.onReport = typeof normalized.onReport === 'function' ? normalized.onReport : undefined
  normalized.enableInteraction = normalized.enableInteraction !== false

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

    // 交互管理器
    this.interaction = {
      activeDanmaku: null,
      activeState: null,
      $tooltip: null,
    }

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.reset = this.reset.bind(this)
    this.resize = this.resize.bind(this)
    this.destroy = this.destroy.bind(this)
    this.onDanmakuClick = this.onDanmakuClick.bind(this)
    this.onDocumentClick = this.onDocumentClick.bind(this)
    this.onTooltipAction = this.onTooltipAction.bind(this)

    art.on('video:play', this.start)
    art.on('video:playing', this.start)
    art.on('video:pause', this.stop)
    art.on('video:waiting', this.stop)
    art.on('video:seeking', this.reset)
    art.on('restart', this.reset)
    art.on('resize', this.resize)
    art.on('destroy', this.destroy)

    // 绑定交互事件
    if (this.option.enableInteraction) {
      this.$danmuku.addEventListener('click', this.onDanmakuClick)
      document.addEventListener('click', this.onDocumentClick)
    }
    else {
      this.$danmuku.dataset.interactionDisabled = 'true'
    }

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
      if (getDanmakuMerge(danmaku))
        return

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

  get mergeVisibles() {
    const result = []

    this.filter('emit', (danmaku) => {
      if (!getDanmakuMerge(danmaku))
        return

      const state = this.getState(danmaku)
      const $ref = state.$ref

      if (!$ref)
        return

      result.push({
        top: $ref.offsetTop,
        height: $ref.clientHeight,
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
        mergeCountAnimation: null,
        mergeCountRef: null,
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

    state.mergeCountAnimation = null
    state.mergeCountRef = null
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
      .filter(isRenderableDanmaku)
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
    if (!isRenderableDanmaku(danmaku))
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
    const shouldReset = !isInit && ['fontSize', 'margin', 'modes', 'speed', 'synchronousPlayback', 'typeOptions'].some(
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
    const merge = getDanmakuMerge(danmaku)

    if (merge)
      return this.showMergeDanmaku(danmaku, merge)

    if (!this.option.modes.includes(danmaku.mode))
      return

    // Ext mode is not yet implemented in the default renderer
    if (danmaku.mode === 'Ext')
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
    $ref.style.color = getDanmakuColor(danmaku, this.option.typeOptions, this.option.color)

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

  async showMergeDanmaku(danmaku, merge) {
    if (!this.option.typeOptions.count)
      return

    const visible = await this.option.beforeVisible(danmaku)
    if (!visible)
      return

    const { clientWidth, clientHeight } = this.$player
    const state = this.getState(danmaku)
    const $ref = this.$ref
    const count = getMergeCount(merge.count)
    const text = getMergeCountText(danmaku, count)
    const fontSize = getMergeFontSize(text, clientWidth, clientHeight)

    state.$ref = $ref
    state.mergeCountRef = setMergeDanmakuContent($ref, danmaku, count)
    $ref.dataset.mode = 'Merge'
    $ref.dataset.id = danmaku.DMID || ''
    $ref.style.opacity = this.option.opacity
    $ref.style.fontSize = `${fontSize}px`
    $ref.style.color = getDanmakuColor(danmaku, this.option.typeOptions, this.option.color)
    $ref.style.zIndex = 1
    $ref.style.display = 'inline-flex'
    $ref.style.alignItems = 'center'
    $ref.style.justifyContent = 'center'
    $ref.style.textAlign = 'center'

    this.$danmuku.appendChild($ref)

    const width = fitMergeFontSize($ref, fontSize, getMergeMaxWidth(clientWidth))
    reserveMergeCountWidth(state.mergeCountRef)
    const height = $ref.clientHeight
    const top = getMergeDanmakuTop({
      height,
      visibles: this.mergeVisibles,
      clientHeight,
    })

    if (this.isStop || top === undefined) {
      this.recycle(danmaku, 'ready')
      return
    }

    state.restTime = getMergeRestTime(merge, this.speed)
    const now = Date.now()
    const animationDuration = getMergeCountAnimationDuration(state.restTime)

    state.lastStartTime = now
    state.mergeCountAnimation = count > 0
      ? {
          target: count,
          duration: animationDuration,
          startTime: now,
          elapsed: 0,
          value: 0,
        }
      : null
    this.setState(danmaku, 'emit')

    setMergeCountText(state.mergeCountRef, state.mergeCountAnimation ? 0 : count)
    $ref.style.width = `${width}px`
    $ref.style.top = `${top}px`
    $ref.style.left = '50%'
    $ref.style.marginLeft = `${-width / 2}px`
    $ref.style.transition = 'transform 0s linear 0s'
    $ref.style.visibility = 'visible'

    this.art.emit('artplayerPluginDanAny:visible', danmaku)
  }

  updateMergeCountAnimations() {
    const now = Date.now()

    this.filter('emit', (danmaku) => {
      const state = this.getState(danmaku)
      const animation = state.mergeCountAnimation
      const $ref = state.$ref
      const $count = state.mergeCountRef

      if (!animation)
        return

      if (!$ref || !$count) {
        state.mergeCountAnimation = null
        return
      }

      const elapsed = clamp(now - animation.startTime, 0, animation.duration)
      const progress = animation.duration > 0 ? elapsed / animation.duration : 1
      const value = progress >= 1
        ? animation.target
        : Math.min(animation.target, Math.round(animation.target * getEaseOutCubic(progress)))

      animation.elapsed = elapsed

      if (value !== animation.value) {
        animation.value = value
        setMergeCountText($count, value)
      }

      if (progress >= 1)
        state.mergeCountAnimation = null
    })
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
        this.updateMergeCountAnimations()
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
    this.closeTooltip()
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

      // 跳过交互暂停的弹幕
      if ($ref.dataset.interactionPaused === 'true')
        return

      this.setState(danmaku, 'emit')
      state.lastStartTime = Date.now()

      if (getDanmakuMerge(danmaku)) {
        if (state.mergeCountAnimation)
          state.mergeCountAnimation.startTime = state.lastStartTime - state.mergeCountAnimation.elapsed

        return
      }

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
    this.updateMergeCountAnimations()
    this.updateRestTimes()

    this.filter('emit', (danmaku) => {
      const state = this.getState(danmaku)
      const $ref = state.$ref

      if (!$ref)
        return

      // 跳过交互暂停的弹幕
      if ($ref.dataset.interactionPaused === 'true')
        return

      this.setState(danmaku, 'stop')

      if (getDanmakuMerge(danmaku))
        return

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

  // 交互方法：暂停弹幕
  pauseDanmaku(danmaku) {
    const state = this.getState(danmaku)
    const $ref = state.$ref

    // 支持 emit 和 stop 状态的弹幕（视频暂停时弹幕处于 stop 状态）
    if (!$ref || (state.status !== 'emit' && state.status !== 'stop'))
      return

    const merge = getDanmakuMerge(danmaku)

    state.pausedAt = Date.now()
    state.wasPaused = true
    $ref.dataset.interactionPaused = 'true'

    // 只有在 emit 状态且是滚动弹幕时才需要固定位置
    if (state.status === 'emit' && !merge && (danmaku.mode === 'Normal' || danmaku.mode === 'Reverse')) {
      const computedStyle = window.getComputedStyle($ref)
      const matrix = new DOMMatrix(computedStyle.transform)

      $ref.style.transition = 'none'
      $ref.style.transform = `translateX(${matrix.m41}px)`
    }

    // 只有在运行中的弹幕才需要更新剩余时间
    if (state.status === 'emit' && state.lastStartTime) {
      const elapsed = (Date.now() - state.lastStartTime) / 1000
      state.restTime -= elapsed
    }
  }

  // 交互方法：恢复弹幕
  resumeDanmaku(danmaku) {
    const state = this.getState(danmaku)
    const $ref = state.$ref

    if (!$ref || !state.wasPaused)
      return

    const merge = getDanmakuMerge(danmaku)
    const { clientWidth } = this.$player

    state.lastStartTime = Date.now()
    state.wasPaused = false
    delete $ref.dataset.interactionPaused

    // 如果弹幕处于 stop 状态（视频暂停），恢复为 emit 状态
    if (state.status === 'stop' && !this.isStop) {
      this.setState(danmaku, 'emit')
    }

    // 只有在播放状态且是滚动弹幕时才恢复动画
    if (!this.isStop && !merge && danmaku.mode === 'Normal') {
      const currentLeft = this.getLeft($ref) - this.getLeft(this.$player)
      const distance = currentLeft + $ref.clientWidth
      $ref.style.transform = `translateX(${-distance}px)`
      $ref.style.transition = `transform ${state.restTime}s linear 0s`
    }
    else if (!this.isStop && !merge && danmaku.mode === 'Reverse') {
      const currentLeft = this.getLeft($ref) - this.getLeft(this.$player)
      const distance = clientWidth - currentLeft
      $ref.style.transform = `translateX(${distance}px)`
      $ref.style.transition = `transform ${state.restTime}s linear 0s`
    }

    if (merge && state.mergeCountAnimation) {
      state.mergeCountAnimation.startTime = Date.now() - state.mergeCountAnimation.elapsed
    }
  }

  // 交互方法：创建按钮
  createButton(action, text, svgIcon) {
    const $btn = document.createElement('button')
    $btn.className = 'apda-tooltip-btn'
    $btn.dataset.action = action
    $btn.type = 'button'
    $btn.title = text
    $btn.innerHTML = `${svgIcon}<span>${text}</span>`
    return $btn
  }

  // 交互方法：创建tooltip
  createTooltip(danmaku, _$ref) {
    const $tooltip = document.createElement('div')
    $tooltip.className = 'apda-danmaku-tooltip'

    const $content = document.createElement('div')
    $content.className = 'apda-tooltip-content'
    $content.textContent = danmaku.content
    $tooltip.appendChild($content)

    const $actions = document.createElement('div')
    $actions.className = 'apda-tooltip-actions'

    const buttons = []

    // 点赞按钮 - 仅当配置了 onLike 时添加
    if (typeof this.option.onLike === 'function') {
      buttons.push(this.createButton('like', '点赞', '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>'))
    }

    // 复制按钮 - 始终添加
    buttons.push(this.createButton('copy', '复制', '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>'))

    // 举报按钮 - 仅当配置了 onReport 时添加
    if (typeof this.option.onReport === 'function') {
      buttons.push(this.createButton('report', '举报', '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/><path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/></svg>'))
    }

    buttons.forEach($btn => $actions.appendChild($btn))
    $tooltip.appendChild($actions)

    $tooltip.addEventListener('click', (e) => {
      e.stopPropagation()
      const $btn = e.target.closest('[data-action]')
      if ($btn)
        this.onTooltipAction($btn.dataset.action, danmaku)
    })

    return $tooltip
  }

  // 交互方法：定位tooltip
  positionTooltip($tooltip, $ref) {
    const refRect = $ref.getBoundingClientRect()
    const playerRect = this.$player.getBoundingClientRect()
    const tooltipRect = $tooltip.getBoundingClientRect()

    let top = refRect.bottom - playerRect.top + 8
    let left = refRect.left - playerRect.left + refRect.width / 2 - tooltipRect.width / 2

    const minLeft = 10
    const maxLeft = playerRect.width - tooltipRect.width - 10
    left = Math.max(minLeft, Math.min(left, maxLeft))

    const maxTop = playerRect.height - tooltipRect.height - 10
    if (top > maxTop) {
      top = refRect.top - playerRect.top - tooltipRect.height - 8
    }

    if (top < 10) {
      top = refRect.top - playerRect.top
      left = refRect.right - playerRect.left + 8

      if (left + tooltipRect.width > playerRect.width - 10) {
        left = refRect.left - playerRect.left - tooltipRect.width - 8
      }
    }

    $tooltip.style.top = `${Math.max(10, top)}px`
    $tooltip.style.left = `${left}px`
  }

  // 交互方法：点击弹幕
  onDanmakuClick(event) {
    const $ref = event.target.closest('.apda-danmaku')
    if (!$ref)
      return

    event.stopPropagation()

    let targetDanmaku = null

    // 搜索 emit 和 stop 状态的弹幕（支持暂停状态下的点击）
    this.filter('emit', (danmaku) => {
      const state = this.getState(danmaku)
      if (state.$ref === $ref) {
        targetDanmaku = danmaku
      }
    })

    if (!targetDanmaku) {
      this.filter('stop', (danmaku) => {
        const state = this.getState(danmaku)
        if (state.$ref === $ref) {
          targetDanmaku = danmaku
        }
      })
    }

    if (!targetDanmaku)
      return

    if (this.interaction.activeDanmaku === targetDanmaku) {
      this.closeTooltip()
      return
    }

    this.closeTooltip()

    this.interaction.activeDanmaku = targetDanmaku
    this.interaction.activeState = this.getState(targetDanmaku)

    this.pauseDanmaku(targetDanmaku)

    const $tooltip = this.createTooltip(targetDanmaku, $ref)
    this.interaction.$tooltip = $tooltip
    this.$danmuku.appendChild($tooltip)

    requestAnimationFrame(() => {
      this.positionTooltip($tooltip, $ref)
    })

    $ref.classList.add('apda-danmaku-active')
  }

  // 交互方法：关闭tooltip
  closeTooltip() {
    if (!this.interaction.activeDanmaku)
      return

    this.resumeDanmaku(this.interaction.activeDanmaku)

    const state = this.interaction.activeState
    if (state?.$ref) {
      state.$ref.classList.remove('apda-danmaku-active')
    }

    if (this.interaction.$tooltip) {
      this.interaction.$tooltip.remove()
      this.interaction.$tooltip = null
    }

    this.interaction.activeDanmaku = null
    this.interaction.activeState = null
  }

  // 交互方法：文档点击
  onDocumentClick(event) {
    if (!this.$danmuku.contains(event.target)) {
      this.closeTooltip()
    }
  }

  // 交互方法：按钮操作
  onTooltipAction(action, danmaku) {
    const $tooltip = this.interaction.$tooltip
    if (!$tooltip)
      return

    const $btn = $tooltip.querySelector(`[data-action="${action}"]`)

    switch (action) {
      case 'like':
        this.handleLike(danmaku, $btn)
        break
      case 'copy':
        this.handleCopy(danmaku, $btn)
        break
      case 'report':
        this.handleReport(danmaku, $btn)
        break
    }
  }

  // 交互方法：处理点赞
  async handleLike(danmaku, $btn) {
    if (!this.option.onLike)
      return

    $btn?.classList.add('apda-tooltip-btn-active')

    this.art.emit('artplayerPluginDanAny:like', danmaku)

    try {
      await this.option.onLike(danmaku)
    }
    catch (error) {
      this.art.emit('artplayerPluginDanAny:error', error)
    }

    setTimeout(() => {
      $btn?.classList.remove('apda-tooltip-btn-active')
      this.closeTooltip()
    }, 300)
  }

  // 交互方法：处理复制
  async handleCopy(danmaku, $btn) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(danmaku.content)
      }
      else {
        this.fallbackCopy(danmaku.content)
      }

      if ($btn) {
        const $span = $btn.querySelector('span')
        const originalText = $span.textContent
        $span.textContent = '已复制'
        $btn.classList.add('apda-tooltip-btn-success')

        setTimeout(() => {
          $span.textContent = originalText
          $btn.classList.remove('apda-tooltip-btn-success')
          this.closeTooltip()
        }, 1000)
      }

      this.art.emit('artplayerPluginDanAny:copy', danmaku)
    }
    catch (error) {
      console.error('Copy failed:', error)

      if ($btn) {
        const $span = $btn.querySelector('span')
        const originalText = $span.textContent
        $span.textContent = '复制失败'
        $btn.classList.add('apda-tooltip-btn-error')

        setTimeout(() => {
          $span.textContent = originalText
          $btn.classList.remove('apda-tooltip-btn-error')
        }, 1000)
      }
    }
  }

  // 交互方法：降级复制方案
  fallbackCopy(text) {
    const $textarea = document.createElement('textarea')
    $textarea.value = text
    $textarea.style.position = 'fixed'
    $textarea.style.opacity = '0'
    document.body.appendChild($textarea)
    $textarea.select()
    document.execCommand('copy')
    document.body.removeChild($textarea)
  }

  // 交互方法：处理举报
  async handleReport(danmaku, $btn) {
    if (!this.option.onReport)
      return

    $btn?.classList.add('apda-tooltip-btn-active')

    this.art.emit('artplayerPluginDanAny:report', danmaku)

    try {
      await this.option.onReport(danmaku)
    }
    catch (error) {
      this.art.emit('artplayerPluginDanAny:error', error)
    }

    setTimeout(() => {
      $btn?.classList.remove('apda-tooltip-btn-active')
      this.closeTooltip()
    }, 300)
  }

  destroy() {
    if (this.destroyed)
      return

    this.destroyed = true
    this.closeTooltip()
    this.stop()
    this.clear()

    if (this.option.enableInteraction) {
      this.$danmuku.removeEventListener('click', this.onDanmakuClick)
      document.removeEventListener('click', this.onDocumentClick)
    }

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
