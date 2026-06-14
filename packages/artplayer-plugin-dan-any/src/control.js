import iconCheckOff from '../../artplayer-plugin-danmuku/src/img/check_off.svg?raw'
import iconCheckOn from '../../artplayer-plugin-danmuku/src/img/check_on.svg?raw'
import iconConfig from '../../artplayer-plugin-danmuku/src/img/config.svg?raw'
import iconMode0Off from '../../artplayer-plugin-danmuku/src/img/mode_0_off.svg?raw'
import iconMode0On from '../../artplayer-plugin-danmuku/src/img/mode_0_on.svg?raw'
import iconMode1Off from '../../artplayer-plugin-danmuku/src/img/mode_1_off.svg?raw'
import iconMode1On from '../../artplayer-plugin-danmuku/src/img/mode_1_on.svg?raw'
import iconMode2Off from '../../artplayer-plugin-danmuku/src/img/mode_2_off.svg?raw'
import iconMode2On from '../../artplayer-plugin-danmuku/src/img/mode_2_on.svg?raw'
import iconOff from '../../artplayer-plugin-danmuku/src/img/off.svg?raw'
import iconOn from '../../artplayer-plugin-danmuku/src/img/on.svg?raw'
import iconStyle from '../../artplayer-plugin-danmuku/src/img/style.svg?raw'
import { EMIT_MODES, RENDER_MODES } from './renderer'

function queryMount(mount) {
  if (!mount)
    return null

  if (typeof mount === 'string')
    return document.querySelector(mount)

  return mount
}

function getDefaultMount(art) {
  return art.template.$controlsLeft || art.template.$controlsCenter
}

function modeText(mode) {
  switch (mode) {
    case 'Normal':
      return '滚动'
    case 'Reverse':
      return '逆向'
    case 'Top':
      return '顶部'
    case 'Bottom':
      return '底部'
    case 'Ext':
      return '高级'
    default:
      return mode
  }
}

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  }[char]))
}

function colorToCss(color) {
  const value = Math.max(0, Math.min(0xFFFFFF, Math.round(Number(color) || 0)))
  return `#${value.toString(16).padStart(6, '0')}`
}

function isSameMargin(prev, next) {
  return prev && next && prev[0] === next[0] && prev[1] === next[1]
}

function closest(target, selector) {
  return target && target.closest ? target.closest(selector) : null
}

function modeIcon(mode, active) {
  switch (mode) {
    case 'Normal':
    case 'Reverse':
      return active ? iconMode0On : iconMode0Off
    case 'Top':
      return active ? iconMode1On : iconMode1Off
    case 'Bottom':
      return active ? iconMode2On : iconMode2Off
    default:
      return ''
  }
}

export default class DanAnyControl {
  constructor(art, plugin) {
    this.art = art
    this.plugin = plugin
    this.utils = art.constructor.utils
    this.utils.setStyle(getDefaultMount(art), 'display', 'flex')
    this.$mount = null
    this.outside = false
    this.sliders = {}
    this.dragging = null
    this.lockTimer = null
    this.lockRest = 0
    this.sending = false
    this.emitterSignature = ''
    this.emitterFontSize = this.getInitialFontSize()
    this.emitterColor = this.getInitialColor()
    this.emitterMode = this.getInitialMode()
    this.$control = document.createElement('div')
    this.$control.className = 'artplayer-plugin-dan-any'
    this.$control.innerHTML = this.template

    this.onClick = this.onClick.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerUp = this.onPointerUp.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onFullscreen = this.onFullscreen.bind(this)
    this.onPanelEnter = this.onPanelEnter.bind(this)
    this.onStylePanelEnter = this.onStylePanelEnter.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)

    this.$control.addEventListener('click', this.onClick)
    this.$control.addEventListener('pointerdown', event => this.onPointerDown(event))
    this.$control.querySelector('.apda-config')?.addEventListener('mouseenter', this.onPanelEnter)
    this.bindEmitterEvents()
    document.addEventListener('pointermove', this.onPointerMove)
    document.addEventListener('pointerup', this.onPointerUp)
    art.on('resize', this.onResize)
    art.on('fullscreen', this.onFullscreen)
    art.on('fullscreenWeb', this.onFullscreen)

    this.createSliders()
    this.mount(plugin.option.mount)
    this.update()
  }

  getInitialFontSize() {
    const value = Number(this.plugin.option.emitDefaults?.fontsize)
    return Number.isFinite(value) ? value : 25
  }

  getInitialColor() {
    const value = Number(this.plugin.option.emitDefaults?.color)
    return Number.isFinite(value) ? value : 0xFFFFFF
  }

  getInitialMode() {
    const mode = this.plugin.option.emitDefaults?.mode
    return EMIT_MODES.includes(mode) ? mode : 'Normal'
  }

  get template() {
    return `
      <button class="apda-toggle" type="button" data-action="visible" title="关闭弹幕">
        ${iconOn}${iconOff}
      </button>
      <div class="apda-config">
        <button class="apda-config-button" type="button" title="弹幕设置">${iconConfig}</button>
        <div class="apda-config-panel">
          <div class="apda-config-panel-inner">
            <div class="apda-config-mode">
              <div class="apda-label">按类型屏蔽</div>
              <div class="apda-modes">
                ${RENDER_MODES.map(mode => `
                  <button class="apda-mode" type="button" data-mode="${mode}" title="${modeText(mode)}">
                    ${modeIcon(mode, false)}${modeIcon(mode, true)}
                    <div>${modeText(mode)}</div>
                  </button>
                `).join('')}
              </div>
            </div>
            <div class="apda-config-other">
              <button class="apda-other" type="button" data-action="antiOverlap">
                ${iconCheckOn}${iconCheckOff}
                防止弹幕重叠
              </button>
              <button class="apda-other" type="button" data-action="synchronousPlayback">
                ${iconCheckOn}${iconCheckOff}
                同步视频速度
              </button>
            </div>
            ${this.sliderTemplate('opacity', '不透明度')}
            ${this.sliderTemplate('margin', '显示区域')}
            ${this.sliderTemplate('fontSize', '弹幕字号')}
            ${this.sliderTemplate('speed', '弹幕速度')}
          </div>
        </div>
      </div>
      ${this.emitterTemplate}
    `
  }

  get emitterTemplate() {
    const { option } = this.plugin

    return `
      <div class="apda-emitter">
        <div class="apda-style">
          <button class="apda-style-button" type="button" title="弹幕样式">${iconStyle}</button>
          <div class="apda-style-panel">
            <div class="apda-style-panel-inner">
              <div class="apda-style-section">
                <div class="apda-label">字号</div>
                <div class="apda-style-sizes">
                  ${option.emitterFontSizes.map(item => `
                    <button class="apda-style-size" type="button" data-emitter-font-size="${item.size}">
                      ${escapeText(item.text || `${item.size}px`)}
                    </button>
                  `).join('')}
                </div>
              </div>
              <div class="apda-style-section">
                <div class="apda-label">位置</div>
                <div class="apda-style-modes">
                  ${option.emitterModes.map((item) => {
                    const text = escapeText(item.text || modeText(item.type))

                    return `
                      <button class="apda-style-mode" type="button" data-emitter-mode="${item.type}" title="${text}">
                        ${modeIcon(item.type, true)}
                        <span>${text}</span>
                      </button>
                    `
                  }).join('')}
                </div>
              </div>
              <div class="apda-style-section">
                <div class="apda-label">颜色</div>
                <div class="apda-colors">
                  ${option.emitterColors.map((color) => {
                    const cssColor = colorToCss(color)

                    return `
                      <button
                        class="apda-color"
                        type="button"
                        data-emitter-color="${color}"
                        title="${cssColor}"
                        style="background-color: ${cssColor};"
                      ></button>
                    `
                  }).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <input class="apda-input" type="text" maxlength="${option.maxLength}" placeholder="发个弹幕" />
        <button class="apda-send" type="button" data-action="emit">发送</button>
      </div>
    `
  }

  getEmitterSignature() {
    const { emitterFontSizes, emitterColors, emitterModes, maxLength } = this.plugin.option
    return JSON.stringify([emitterFontSizes, emitterColors, emitterModes, maxLength])
  }

  bindEmitterEvents() {
    this.$control.querySelector('.apda-style')?.addEventListener('mouseenter', this.onStylePanelEnter)
    this.$control.querySelector('.apda-input')?.addEventListener('keydown', this.onKeyDown)
  }

  refreshEmitterTemplate() {
    const signature = this.getEmitterSignature()

    if (signature === this.emitterSignature)
      return

    const $emitter = this.$control.querySelector('.apda-emitter')

    if ($emitter) {
      $emitter.outerHTML = this.emitterTemplate
      this.bindEmitterEvents()
    }

    this.emitterSignature = signature
  }

  sliderTemplate(name, label) {
    return `
      <div class="apda-config-slider apda-config-${name}" data-slider="${name}">
        <div class="apda-label">${label}</div>
        <div class="apda-slider">
          <div class="apda-slider-line">
            <div class="apda-slider-points"></div>
            <div class="apda-slider-progress"></div>
          </div>
          <div class="apda-slider-dot"></div>
          <div class="apda-slider-steps"></div>
        </div>
        <div class="apda-value">未知</div>
      </div>
    `
  }

  get marginSteps() {
    return [
      { name: '1/4', value: [10, '75%'] },
      { name: '半屏', value: [10, '50%'] },
      { name: '3/4', value: [10, '25%'] },
      { name: '满屏', value: [10, 10] },
    ]
  }

  get speedSteps() {
    return [
      { name: '极慢', value: 10 },
      { name: '较慢', value: 7.5, hide: true },
      { name: '适中', value: 5 },
      { name: '较快', value: 2.5, hide: true },
      { name: '极快', value: 1 },
    ]
  }

  createSliders() {
    this.createSlider('opacity', {
      min: 0,
      max: 100,
      findIndex: () => Math.round(this.plugin.option.opacity * 100),
      label: index => `${index}%`,
      onChange: index => this.plugin.config({ opacity: index / 100 }),
    })

    this.createSlider('margin', {
      min: 0,
      max: this.marginSteps.length - 1,
      steps: this.marginSteps,
      findIndex: () => this.marginSteps.findIndex(item => isSameMargin(item.value, this.plugin.option.margin)),
      label: index => this.marginSteps[index]?.name || '未知',
      onChange: (index) => {
        const step = this.marginSteps[index]
        if (step)
          this.plugin.config({ margin: step.value })
      },
    })

    this.createSlider('fontSize', {
      min: 12,
      max: 120,
      findIndex: () => {
        const value = this.plugin.option.fontSize
        return typeof value === 'number' ? value : 25
      },
      label: index => `${index}px`,
      onChange: index => this.plugin.config({ fontSize: index }),
    })

    this.createSlider('speed', {
      min: 0,
      max: this.speedSteps.length - 1,
      steps: this.speedSteps,
      findIndex: () => this.speedSteps.findIndex(item => item.value === this.plugin.option.speed),
      label: index => this.speedSteps[index]?.name || '未知',
      onChange: (index) => {
        const step = this.speedSteps[index]
        if (step)
          this.plugin.config({ speed: step.value })
      },
    })
  }

  createSlider(name, slider) {
    const $root = this.$control.querySelector(`[data-slider="${name}"]`)
    const $slider = $root?.querySelector('.apda-slider')
    const $points = $root?.querySelector('.apda-slider-points')
    const $steps = $root?.querySelector('.apda-slider-steps')

    if (!$root || !$slider)
      return

    if (slider.steps?.length) {
      $points.innerHTML = slider.steps.map(() => '<div class="apda-slider-point"></div>').join('')
      $steps.innerHTML = slider.steps.map(step => (step.hide ? '' : `<div class="apda-slider-step">${step.name}</div>`)).join('')
    }

    this.sliders[name] = {
      ...slider,
      $root,
      $slider,
      $dot: $root.querySelector('.apda-slider-dot'),
      $progress: $root.querySelector('.apda-slider-progress'),
      $value: $root.querySelector('.apda-value'),
    }
  }

  updateSlider(name, index = this.sliders[name]?.findIndex()) {
    const slider = this.sliders[name]

    if (!slider)
      return

    if (index < slider.min || index > slider.max) {
      slider.$value.textContent = '未知'
      return
    }

    const percentage = slider.max === slider.min ? 0 : (index - slider.min) / (slider.max - slider.min)
    slider.$dot.style.left = `${percentage * 100}%`
    slider.$progress.style.width = slider.steps?.length ? '0%' : slider.$dot.style.left
    slider.$value.textContent = slider.label(index)
  }

  setSliderByEvent(name, event) {
    const slider = this.sliders[name]

    if (!slider)
      return

    const rect = slider.$slider.getBoundingClientRect()
    const { clamp } = this.utils
    const value = this.art.isRotate
      ? clamp(event.clientY - rect.top, 0, rect.height) / rect.height
      : clamp(event.clientX - rect.left, 0, rect.width) / rect.width
    const index = Math.round(value * (slider.max - slider.min) + slider.min)

    slider.onChange(index)
  }

  onPointerDown(event) {
    const $slider = closest(event.target, '.apda-slider')
    const $root = closest($slider, '[data-slider]')

    if (!$root || event.button !== 0)
      return

    this.dragging = $root.dataset.slider
    this.setSliderByEvent(this.dragging, event)
  }

  onPointerMove(event) {
    if (this.dragging)
      this.setSliderByEvent(this.dragging, event)
  }

  onPointerUp(event) {
    if (!this.dragging)
      return

    this.setSliderByEvent(this.dragging, event)
    this.dragging = null
  }

  updateEmitterState() {
    this.$control.querySelectorAll('[data-emitter-font-size]').forEach(($button) => {
      $button.dataset.active = String(Number($button.dataset.emitterFontSize) === this.emitterFontSize)
    })

    this.$control.querySelectorAll('[data-emitter-color]').forEach(($button) => {
      $button.dataset.active = String(Number($button.dataset.emitterColor) === this.emitterColor)
    })

    this.$control.querySelectorAll('[data-emitter-mode]').forEach(($button) => {
      $button.dataset.active = String($button.dataset.emitterMode === this.emitterMode)
    })
  }

  updateSendState() {
    const $send = this.$control.querySelector('.apda-send')

    if (!$send)
      return

    $send.dataset.lock = String(this.lockRest > 0)
    $send.dataset.sending = String(this.sending)
    $send.disabled = this.lockRest > 0 || this.sending
    $send.textContent = this.lockRest > 0
      ? `${this.lockRest}s`
      : this.sending
        ? '发送中'
        : '发送'
  }

  clearLock() {
    if (this.lockTimer) {
      window.clearInterval(this.lockTimer)
      this.lockTimer = null
    }

    this.lockRest = 0
    this.updateSendState()
  }

  lock() {
    this.clearLock()
    this.lockRest = Math.round(this.plugin.option.lockTime)
    this.updateSendState()
    this.lockTimer = window.setInterval(() => {
      this.lockRest -= 1

      if (this.lockRest <= 0) {
        this.clearLock()
        return
      }

      this.updateSendState()
    }, 1000)
  }

  async send() {
    if (this.sending || this.lockRest > 0)
      return

    const $input = this.$control.querySelector('.apda-input')
    const content = $input?.value.trim()

    if (!content)
      return

    let danmaku = null
    this.sending = true
    this.updateSendState()

    try {
      danmaku = await this.plugin.createEmitterDanmaku({
        content,
        fontsize: this.emitterFontSize,
        color: this.emitterColor,
        mode: this.emitterMode,
      })

      const emitted = await this.plugin.emit(danmaku)

      if (emitted) {
        $input.value = ''
        this.lock()
      }
    }
    catch (error) {
      if (!danmaku)
        this.art.emit('artplayerPluginDanAny:error', error)
    }
    finally {
      this.sending = false
      this.updateSendState()
    }
  }

  onKeyDown(event) {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing)
      return

    event.preventDefault()
    this.send()
  }

  onClick(event) {
    const $target = closest(
      event.target,
      '[data-action], [data-mode], [data-emitter-font-size], [data-emitter-color], [data-emitter-mode]',
    )

    if (!$target)
      return

    const { option } = this.plugin

    if (Object.prototype.hasOwnProperty.call($target.dataset, 'emitterFontSize')) {
      this.emitterFontSize = Number($target.dataset.emitterFontSize)
      this.updateEmitterState()
      return
    }

    if (Object.prototype.hasOwnProperty.call($target.dataset, 'emitterColor')) {
      this.emitterColor = Number($target.dataset.emitterColor)
      this.updateEmitterState()
      return
    }

    if (Object.prototype.hasOwnProperty.call($target.dataset, 'emitterMode')) {
      this.emitterMode = $target.dataset.emitterMode
      this.updateEmitterState()
      return
    }

    if ($target.dataset.action === 'visible') {
      this.plugin.config({ visible: !option.visible })
      return
    }

    if ($target.dataset.action === 'emit') {
      this.send()
      return
    }

    if ($target.dataset.action === 'antiOverlap') {
      this.plugin.config({ antiOverlap: !option.antiOverlap })
      return
    }

    if ($target.dataset.action === 'synchronousPlayback') {
      this.plugin.config({ synchronousPlayback: !option.synchronousPlayback })
      return
    }

    if ($target.dataset.mode) {
      const mode = $target.dataset.mode
      const modes = option.modes.includes(mode)
        ? option.modes.filter(item => item !== mode)
        : [...option.modes, mode]

      this.plugin.config({
        modes: modes.filter(item => RENDER_MODES.includes(item)),
      })
    }
  }

  adjustPanel($root, $panel) {
    const { $player } = this.art.template

    if (!$root || !$panel || !$player)
      return

    const controlRect = $root.getBoundingClientRect()
    const panelRect = $panel.getBoundingClientRect()
    const playerRect = $player.getBoundingClientRect()
    const half = panelRect.width / 2 - controlRect.width / 2
    const left = playerRect.left - (controlRect.left - half)
    const right = controlRect.right + half - playerRect.right

    if (left > 0)
      $panel.style.left = `${-half + left}px`
    else if (right > 0)
      $panel.style.left = `${-half - right}px`
    else
      $panel.style.left = `${-half}px`
  }

  onPanelEnter() {
    this.adjustPanel(
      this.$control.querySelector('.apda-config'),
      this.$control.querySelector('.apda-config-panel'),
    )
  }

  onStylePanelEnter() {
    this.adjustPanel(
      this.$control.querySelector('.apda-style'),
      this.$control.querySelector('.apda-style-panel'),
    )
  }

  append($mount) {
    if (!$mount || $mount === this.$control.parentElement)
      return

    $mount.appendChild(this.$control)
  }

  mount(mount) {
    const $defaultMount = getDefaultMount(this.art)
    const $mount = queryMount(mount) || $defaultMount

    if (!$mount)
      return

    this.$mount = $mount
    this.outside = $mount !== $defaultMount
    this.append($mount)
    this.update()
  }

  onFullscreen(state) {
    const $defaultMount = getDefaultMount(this.art)

    if (this.outside) {
      this.append(state ? $defaultMount : this.$mount)
    }
    else {
      this.append($defaultMount)
    }
  }

  onResize() {
    if (this.outside || this.art.fullscreen || this.art.fullscreenWeb)
      return

    const { $player } = this.art.template
    const $defaultMount = getDefaultMount(this.art)

    if (this.art.width < this.plugin.option.width)
      this.append($player)
    else
      this.append($defaultMount)
  }

  update() {
    const { option } = this.plugin
    const { $player } = this.art.template

    this.refreshEmitterTemplate()
    this.$control.dataset.visible = String(option.visible)
    this.$control.dataset.antiOverlap = String(option.antiOverlap)
    this.$control.dataset.synchronousPlayback = String(option.synchronousPlayback)
    this.$control.dataset.emitter = String(option.emitter !== false)
    this.$control.dataset.danAnyVisible = String(option.visible)
    this.$control.dataset.danAnyAntiOverlap = String(option.antiOverlap)
    this.$control.dataset.danAnySynchronousPlayback = String(option.synchronousPlayback)
    this.$control.dataset.danAnyEmitter = String(option.emitter !== false)

    if ($player) {
      $player.dataset.danAnyVisible = String(option.visible)
      $player.dataset.danAnyAntiOverlap = String(option.antiOverlap)
      $player.dataset.danAnySynchronousPlayback = String(option.synchronousPlayback)
      $player.dataset.danAnyEmitter = String(option.emitter !== false)
    }

    for (let index = 0; index < RENDER_MODES.length; index++) {
      const mode = RENDER_MODES[index]
      const active = option.modes.includes(mode)
      const $button = this.$control.querySelector(`[data-mode="${mode}"]`)

      if ($button)
        $button.dataset.active = String(active)

      if ($player)
        $player.dataset[`danAnyMode${mode}`] = String(active)
    }

    const $input = this.$control.querySelector('.apda-input')
    if ($input)
      $input.maxLength = option.maxLength

    Object.keys(this.sliders).forEach(name => this.updateSlider(name))
    this.updateEmitterState()
    this.updateSendState()
    this.onResize()
  }

  destroy() {
    this.clearLock()
    this.$control.removeEventListener('click', this.onClick)
    this.$control.querySelector('.apda-config')?.removeEventListener('mouseenter', this.onPanelEnter)
    this.$control.querySelector('.apda-style')?.removeEventListener('mouseenter', this.onStylePanelEnter)
    this.$control.querySelector('.apda-input')?.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerup', this.onPointerUp)
    this.art.off('resize', this.onResize)
    this.art.off('fullscreen', this.onFullscreen)
    this.art.off('fullscreenWeb', this.onFullscreen)
    this.$control.remove()
  }
}
