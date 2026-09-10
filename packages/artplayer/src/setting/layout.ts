import { isMobile } from '../utils/compatibility'

interface LayoutItem {
  readonly $parent?: { width?: number }
}

export interface SettingLayout {
  active: LayoutItem[] | null
  option: LayoutItem[]
  show: boolean
  art: {
    isRotate: boolean
    controls: { setting?: HTMLElement }
    constructor: { SETTING_WIDTH: number, SETTING_ITEM_HEIGHT: number }
    template: { $player: HTMLElement, $setting: HTMLElement, $bottom: HTMLElement }
  }
}

export interface LayoutInput {
  containerWidth: number
  containerHeight: number
  requestedWidth: number
  rows: number
  rowHeight: number
  controlCenter: number
  bottom: number
  padding: number
}

export function calculateSettingLayout(input: LayoutInput): { width: number, height: number, left: number } {
  const { containerWidth, containerHeight, requestedWidth, rows, rowHeight, controlCenter, bottom, padding } = input
  const inset = Math.min(Math.max(0, padding), Math.max(0, containerWidth / 2))
  const width = Math.min(Math.max(0, requestedWidth), Math.max(0, containerWidth - 2 * inset))
  const height = Math.min(Math.max(0, rows * rowHeight), Math.max(0, containerHeight - bottom - inset))
  const left = Math.max(inset, Math.min(controlCenter - width / 2, containerWidth - inset - width))
  return { width, height, left }
}

export function resizeSetting(setting: SettingLayout): void {
  const { art, active } = setting
  const { controls, constructor: { SETTING_WIDTH, SETTING_ITEM_HEIGHT }, template: { $player, $setting, $bottom } } = art
  if (!controls.setting || !setting.show || !active)
    return
  const player = $player.getBoundingClientRect()
  const control = controls.setting.getBoundingClientRect()
  const scale = player.width / $player.offsetWidth || 1
  const controlCenter = (control.left - player.left + control.width / 2) / scale - $player.clientLeft
  const layout = calculateSettingLayout({
    containerWidth: $player.clientWidth,
    containerHeight: $player.clientHeight,
    requestedWidth: active[0]?.$parent?.width || SETTING_WIDTH,
    rows: active.length + (active === setting.option ? 0 : 1),
    rowHeight: SETTING_ITEM_HEIGHT,
    controlCenter,
    bottom: Number.parseFloat(getComputedStyle($setting).bottom) || 0,
    padding: Number.parseFloat(getComputedStyle($bottom).paddingLeft) || 0,
  })
  $setting.style.height = `${layout.height}px`
  $setting.style.width = `${layout.width}px`
  if (art.isRotate || isMobile)
    return
  if (controlCenter + layout.width / 2 > $player.clientWidth) {
    // Preserve the existing CSS right-edge anchor when centering would overflow.
    $setting.style.left = ''
    $setting.style.right = ''
  }
  else {
    $setting.style.left = `${layout.left}px`
    $setting.style.right = 'auto'
  }
}
