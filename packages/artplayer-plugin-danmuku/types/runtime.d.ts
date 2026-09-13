import type { RuntimeFactory } from './runtime-shared.js'

declare const artplayerPluginDanmuku: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Ambient merge exposes types on the CommonJS factory.
declare namespace artplayerPluginDanmuku {
  type Danmu = import('./runtime-shared.js').Danmu
  type EventMap = import('./runtime-shared.js').EventMap
  type Heatmap = import('./runtime-shared.js').Heatmap
  type Icons = import('./runtime-shared.js').Icons
  type Input = import('./runtime-shared.js').Input
  type Item = import('./runtime-shared.js').Item
  type Margin = import('./runtime-shared.js').Margin
  type Mode = import('./runtime-shared.js').Mode
  type NormalizedDanmu = import('./runtime-shared.js').NormalizedDanmu
  type NormalizedOption = import('./runtime-shared.js').NormalizedOption
  type Owner = import('./runtime-shared.js').Owner
  type Point = import('./runtime-shared.js').Point
  type RuntimeFactory = import('./runtime-shared.js').RuntimeFactory
  type RuntimeOption = import('./runtime-shared.js').RuntimeOption
  type RuntimeResult = import('./runtime-shared.js').RuntimeResult
  type Slider<Value = number> = import('./runtime-shared.js').Slider<Value>
  type SliderStep<Value = number> = import('./runtime-shared.js').SliderStep<Value>
  type State = import('./runtime-shared.js').State
}
export = artplayerPluginDanmuku
