import type Artplayer from 'artplayer'

// Public runtime data has one declaration source; host and Worker adapters stay internal.
export type {
  Danmu as DanmuInput,
  Item as DanmuItem,
  Input as DanmukuInput,
  RuntimeOption as DanmukuOption,
  State as DanmuState,
  Heatmap as HeatmapOptions,
  Point as HeatmapPoint,
  NormalizedDanmu,
  NormalizedOption,
  Slider as SliderOption,
  SliderStep,
} from '../types/runtime-shared'

export type DanmukuArt = Artplayer & { constructor: typeof Artplayer, isRotate?: boolean }
export type DanmuStyle = Partial<CSSStyleDeclaration>
