import type { SliderStep } from './types'

// createTemplate/createSliders fill these slots before registering active UI callbacks.
// The initial null values and absent antiOverlap/syncVideo keys are kept for compatibility.
export interface SettingTemplate {
  $controlsCenter: HTMLDivElement
  $mount: HTMLElement
  $danmuku: HTMLDivElement
  $toggle: HTMLDivElement
  $config: HTMLDivElement
  $configPanel: HTMLDivElement
  $configModes: HTMLDivElement
  $style: HTMLDivElement
  $stylePanel: HTMLDivElement
  $styleModes: HTMLDivElement
  $colors: HTMLDivElement
  $antiOverlap?: HTMLDivElement
  $syncVideo?: HTMLDivElement
  $opacitySlider: HTMLDivElement
  $opacityValue: HTMLDivElement
  $marginSlider: HTMLDivElement
  $marginValue: HTMLDivElement
  $fontSizeSlider: HTMLDivElement
  $fontSizeValue: HTMLDivElement
  $speedSlider: HTMLDivElement
  $speedValue: HTMLDivElement
  $input: HTMLInputElement
  $send: HTMLDivElement
}

export interface SettingSlider { reset: (index?: number) => void }
export interface SliderConfig {
  min: number
  max: number
  container: HTMLElement
  findIndex: () => number
  onChange: (index: number) => void
  steps?: SliderStep<unknown>[]
}
