import type Danmuku from './danmuku'
import type { SettingSlider, SettingTemplate, SliderConfig } from './setting-types'
import type { DanmukuArt, NormalizedOption, SliderOption } from './types'
import SettingLifecycle from './setting-lifecycle'
import { emitSetting, lockSetting, unlockSetting } from './setting-send'
import createSlider from './setting-slider'
import { settingIcons, settingTemplate } from './setting-template'
import './setting-style'

export default class Setting {
  declare art: DanmukuArt
  declare danmuku: Danmuku
  declare utils: DanmukuArt['constructor']['utils']
  declare template: SettingTemplate
  declare slider: Record<'opacity' | 'margin' | 'fontSize' | 'speed', SettingSlider>
  declare emitting: boolean
  declare isLock: boolean
  declare timer: ReturnType<typeof setTimeout> | null
  declare lifecycle: SettingLifecycle

  constructor(art: DanmukuArt, danmuku: Danmuku) {
    this.art = art
    this.danmuku = danmuku
    this.utils = art.constructor.utils

    const { setStyle } = this.utils
    const { $controlsCenter } = art.template

    this.template = {
      $controlsCenter,
      $mount: $controlsCenter,
      $danmuku: null!,
      $toggle: null!,
      $config: null!,
      $configPanel: null!,
      $configModes: null!,
      $style: null!,
      $stylePanel: null!,
      $styleModes: null!,
      $colors: null!,
      $opacitySlider: null!,
      $opacityValue: null!,
      $marginSlider: null!,
      $marginValue: null!,
      $fontSizeSlider: null!,
      $fontSizeValue: null!,
      $speedSlider: null!,
      $speedValue: null!,
      $input: null!,
      $send: null!,
    }

    this.slider = {
      opacity: null!,
      margin: null!,
      fontSize: null!,
      speed: null!,
    }

    this.emitting = false
    this.isLock = false
    this.timer = null

    this.lifecycle = new SettingLifecycle(art)
    this.destroy = this.destroy.bind(this)
    this.lifecycle.own(() => art.off('destroy', this.destroy))

    try {
      art.on('destroy', this.destroy)
      if (!this.lifecycle.active)
        return
      this.lifecycle.write($controlsCenter.style, 'display', 'flex', value => setStyle($controlsCenter, 'display', value as string))

      this.createTemplate()
      if (!this.lifecycle.active)
        return
      this.createSliders()
      if (!this.lifecycle.active)
        return
      this.createEvents()

      this.mount(this.option.mount)
      if (!this.lifecycle.active)
        return

      this.lifecycle.on('resize', () => this.resize())
      this.lifecycle.on('fullscreen', state => this.onFullscreen(state))
      this.lifecycle.on('fullscreenWeb', state => this.onFullscreen(state))

      this.lifecycle.proxy(this.template.$config, 'mouseenter', () => {
        this.onMouseEnter({
          $control: this.template.$config,
          $panel: this.template.$configPanel,
        })
      })

      this.lifecycle.proxy(this.template.$style, 'mouseenter', () => {
        this.onMouseEnter({
          $control: this.template.$style,
          $panel: this.template.$stylePanel,
        })
      })
    }
    catch (error) {
      try {
        this.destroy()
      }
      catch (cleanupError) {
        console.warn('Failed to roll back danmuku setting:', cleanupError)
      }
      throw error
    }
  }

  static get icons() {
    return settingIcons()
  }

  get option(): NormalizedOption {
    return this.danmuku.option
  }

  get outside() {
    return this.template.$mount !== this.template.$controlsCenter
  }

  get TEMPLATE() {
    return settingTemplate.call(this)
  }

  get OPACITY(): Required<SliderOption> {
    return {
      min: 0,
      max: 100,
      steps: [],
      ...this.option.OPACITY,
    }
  }

  get FONT_SIZE(): Required<SliderOption> {
    return {
      min: 12,
      max: 120,
      steps: [],
      ...this.option.FONT_SIZE,
    }
  }

  get MARGIN(): Required<SliderOption<NormalizedOption['margin']>> {
    return {
      min: 0,
      max: 3,
      steps: [
        {
          name: '1/4',
          value: [10, '75%'],
        },
        {
          name: '半屏',
          value: [10, '50%'],
        },
        {
          name: '3/4',
          value: [10, '25%'],
        },
        {
          name: '满屏',
          value: [10, 10],
        },
      ],
      ...this.option.MARGIN,
    }
  }

  get SPEED(): Required<SliderOption> {
    return {
      min: 0,
      max: 4,
      steps: [
        {
          name: '极慢',
          value: 10,
        },
        {
          name: '较慢',
          value: 7.5,
          hide: true,
        },
        {
          name: '适中',
          value: 5,
        },
        {
          name: '较快',
          value: 2.5,
          hide: true,
        },
        {
          name: '极快',
          value: 1,
        },
      ],
      ...this.option.SPEED,
    }
  }

  get COLOR() {
    return this.option.COLOR.length
      ? this.option.COLOR
      : [
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
        ]
  }

  query<T extends HTMLElement = HTMLDivElement>(selector: string): T {
    const { query } = this.utils
    const { $danmuku } = this.template
    return query(selector, $danmuku) as T
  }

  append(el: HTMLElement, target: HTMLElement) {
    if (!this.lifecycle.active)
      return
    const { append } = this.utils
    const children = [...el.children]
    if (children.includes(target))
      return
    append(el, target)
  }

  setData(key: string, value: string | number | boolean) {
    if (!this.lifecycle.active)
      return
    const { $player } = this.art.template
    const { $mount } = this.template
    this.lifecycle.write($player.dataset, key, value)
    if (this.outside) {
      this.lifecycle.write($mount.dataset, key, value)
    }
  }

  createTemplate() {
    const { createElement, tooltip } = this.utils

    const $danmuku = createElement('div')
    this.template.$danmuku = $danmuku
    $danmuku.className = 'artplayer-plugin-danmuku'
    $danmuku.innerHTML = this.TEMPLATE

    this.template.$toggle = this.query('.apd-toggle')
    this.template.$config = this.query('.apd-config')
    this.template.$configPanel = this.query('.apd-config-panel')
    this.template.$configModes = this.query('.apd-config-mode .apd-modes')
    this.template.$style = this.query('.apd-style')
    this.template.$stylePanel = this.query('.apd-style-panel')
    this.template.$styleModes = this.query('.apd-style-mode .apd-modes')
    this.template.$colors = this.query('.apd-colors')
    this.template.$antiOverlap = this.query('.apd-anti-overlap')
    this.template.$syncVideo = this.query('.apd-sync-video')
    this.template.$opacitySlider = this.query('.apd-config-opacity .apd-slider')
    this.template.$opacityValue = this.query('.apd-config-opacity .apd-value')
    this.template.$marginSlider = this.query('.apd-config-margin .apd-slider')
    this.template.$marginValue = this.query('.apd-config-margin .apd-value')
    this.template.$fontSizeSlider = this.query('.apd-config-fontSize .apd-slider')
    this.template.$fontSizeValue = this.query('.apd-config-fontSize .apd-value')
    this.template.$speedSlider = this.query('.apd-config-speed .apd-slider')
    this.template.$speedValue = this.query('.apd-config-speed .apd-value')
    this.template.$input = this.query<HTMLInputElement>('.apd-input')
    this.template.$send = this.query('.apd-send')

    const { $toggle } = this.template

    this.lifecycle.on('artplayerPluginDanmuku:show', () => {
      tooltip($toggle, '关闭弹幕')
    })

    this.lifecycle.on('artplayerPluginDanmuku:hide', () => {
      tooltip($toggle, '打开弹幕')
    })
  }

  createEvents() {
    const { $toggle, $configModes, $styleModes, $colors, $antiOverlap, $syncVideo, $send, $input } = this.template

    this.lifecycle.proxy($toggle, 'click', () => {
      this.danmuku.config({
        visible: !this.option.visible,
      })
      this.reset()
    })

    this.lifecycle.proxy($configModes, 'click', (event) => {
      const $mode = (event.target as HTMLElement).closest<HTMLElement>('.apd-mode')
      if (!$mode)
        return
      const mode = Number($mode.dataset.mode)
      if (this.option.modes.includes(mode)) {
        this.danmuku.config({
          modes: this.option.modes.filter(m => m !== mode),
        })
      }
      else {
        this.danmuku.config({
          modes: [...this.option.modes, mode],
        })
      }
      this.reset()
    })

    this.lifecycle.proxy($antiOverlap!, 'click', () => {
      this.danmuku.config({
        antiOverlap: !this.option.antiOverlap,
      })
      this.reset()
    })

    this.lifecycle.proxy($syncVideo!, 'click', () => {
      this.danmuku.config({
        synchronousPlayback: !this.option.synchronousPlayback,
      })
      this.reset()
    })

    this.lifecycle.proxy($styleModes, 'click', (event) => {
      const $mode = (event.target as HTMLElement).closest<HTMLElement>('.apd-mode')
      if (!$mode)
        return
      const mode = Number($mode.dataset.mode)
      this.danmuku.config({
        mode,
      })
      this.reset()
    })

    this.lifecycle.proxy($colors, 'click', (event) => {
      const $color = (event.target as HTMLElement).closest<HTMLElement>('.apd-color')
      if (!$color)
        return
      this.danmuku.config({
        color: $color.dataset.color,
      })
      this.reset()
    })

    this.lifecycle.proxy($send, 'click', () => this.emit())

    this.lifecycle.proxy($input, 'keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.emit()
      }
    })
  }

  createSliders() {
    this.slider.opacity = this.createSlider({
      ...this.OPACITY,
      container: this.template.$opacitySlider,
      findIndex: () => {
        return Math.round(this.option.opacity * 100)
      },
      onChange: (index) => {
        const { $opacityValue } = this.template
        $opacityValue.textContent = `${index}%`
        this.danmuku.config({
          opacity: index / 100,
        })
      },
    })

    this.slider.margin = this.createSlider({
      ...this.MARGIN,
      container: this.template.$marginSlider,
      findIndex: () => {
        return this.MARGIN.steps.findIndex(
          item => item.value![0] === this.option.margin[0] && item.value![1] === this.option.margin[1],
        )
      },
      onChange: (index) => {
        const margin = this.MARGIN.steps[index]
        if (!margin)
          return
        const { $marginValue } = this.template
        $marginValue.textContent = margin.name as string
        this.danmuku.config({
          margin: margin.value,
        })
      },
    })

    this.slider.fontSize = this.createSlider({
      ...this.FONT_SIZE,
      container: this.template.$fontSizeSlider,
      findIndex: () => {
        return this.danmuku.fontSize
      },
      onChange: (index) => {
        const { $fontSizeValue } = this.template
        $fontSizeValue.textContent = `${index}px`
        if (index === this.danmuku.fontSize)
          return
        this.danmuku.config({
          fontSize: index,
        })
      },
    })

    this.slider.speed = this.createSlider({
      ...this.SPEED,
      container: this.template.$speedSlider,
      findIndex: () => {
        return this.SPEED.steps.findIndex(item => item.value === this.option.speed)
      },
      onChange: (index) => {
        const speed = this.SPEED.steps[index]
        if (!speed)
          return
        const { $speedValue } = this.template
        $speedValue.textContent = speed.name as string
        this.danmuku.config({
          speed: speed.value,
        })
      },
    })
  }

  createSlider(option: SliderConfig) {
    return createSlider.call(this, option)
  }

  onFullscreen(state: boolean) {
    if (!this.lifecycle.active)
      return
    const { $danmuku, $controlsCenter, $mount } = this.template
    if (this.outside) {
      if (state) {
        this.append($controlsCenter, $danmuku)
      }
      else {
        this.append($mount, $danmuku)
      }
    }
    else {
      this.append($controlsCenter, $danmuku)
    }
  }

  onMouseEnter({ $control, $panel }: { $control: HTMLElement, $panel: HTMLElement }) {
    if (!this.lifecycle.active)
      return
    const { $player } = this.art.template
    const controlRect = $control.getBoundingClientRect()
    const panelRect = $panel.getBoundingClientRect()
    const playerRect = $player.getBoundingClientRect()

    const half = panelRect.width / 2 - controlRect.width / 2
    const left = playerRect.left - (controlRect.left - half)
    const right = controlRect.right + half - playerRect.right

    if (left > 0) {
      $panel.style.left = `${-half + left}px`
    }
    else if (right > 0) {
      $panel.style.left = `${-half - right}px`
    }
    else {
      $panel.style.left = `${-half}px`
    }
  }

  emit() {
    return emitSetting(this)
  }

  lock() {
    lockSetting(this)
  }

  unlock() {
    unlockSetting(this)
  }

  resize() {
    if (!this.lifecycle.active)
      return
    if (this.outside)
      return
    if (this.art.fullscreen)
      return
    if (this.art.fullscreenWeb)
      return
    const { $player, $controlsCenter } = this.art.template
    const { $danmuku } = this.template
    if (this.art.width < this.option.width) {
      this.append($player, $danmuku)
    }
    else {
      this.append($controlsCenter, $danmuku)
    }
  }

  reset() {
    if (!this.lifecycle.active)
      return
    const { inverseClass, tooltip } = this.utils
    const { $toggle, $colors } = this.template

    for (const slider of Object.values(this.slider)) {
      slider.reset()
      if (!this.lifecycle.active)
        return
    }

    this.setData('danmukuVisible', this.option.visible)
    this.setData('danmukuMode', this.option.mode)
    this.setData('danmukuColor', this.option.color)
    this.setData('danmukuMode0', this.option.modes.includes(0))
    this.setData('danmukuMode1', this.option.modes.includes(1))
    this.setData('danmukuMode2', this.option.modes.includes(2))
    this.setData('danmukuAntiOverlap', this.option.antiOverlap)
    this.setData('danmukuSyncVideo', this.option.synchronousPlayback)
    this.setData('danmukuTheme', this.option.theme)
    this.setData('danmukuEmitter', this.option.emitter)

    const colors = $colors.children as HTMLCollectionOf<HTMLElement>
    const $color = Array.from(colors).find(item => item.dataset.color === this.option.color.toUpperCase())
    $color && inverseClass($color, 'apd-active')

    tooltip($toggle, this.option.visible ? '关闭弹幕' : '打开弹幕')

    this.resize()
  }

  mount(target: NormalizedOption['mount']) {
    if (!this.lifecycle.active)
      return
    const { errorHandle } = this.utils
    const $el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    errorHandle($el as unknown as boolean, `Can not find the mount point: ${target}`)
    this.append($el!, this.template.$danmuku)
    this.template.$mount = $el!
    this.reset()
  }

  destroy() {
    if (this.lifecycle.closed)
      return
    this.lifecycle.close()
    clearTimeout(this.timer as number | undefined)
    this.timer = null
    this.emitting = false
    this.isLock = false
    const $danmuku = this.template.$danmuku
    if ($danmuku?.parentElement)
      $danmuku.parentElement.removeChild($danmuku)
  }
}
