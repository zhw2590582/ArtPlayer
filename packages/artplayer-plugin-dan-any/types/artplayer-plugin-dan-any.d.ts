import type Artplayer from 'artplayer'
import type { Adapter, Metadata, Plugin } from '@dan-uni/dan-any/adapters'
import type { UDanmaku, UniChunk } from '@dan-uni/dan-any/core'

/**
 * 自动识别弹幕格式时使用的 Metadata / Adapter 列表
 */
export type HandlerList = [Metadata, Adapter][]

/**
 * 载入弹幕后按顺序执行的 dan-any Plugin 列表
 */
export type PluginList = Plugin[]

/**
 * 弹幕显示模式
 */
export type Mode = 'Normal' | 'Reverse' | 'Top' | 'Bottom'

/**
 * 弹幕颜色，支持 CSS 颜色字符串、数字字符串和 number 类型颜色值
 */
export type Color = string | number

/**
 * 热力图配置
 */
export interface HeatmapOption {
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  scale?: number
  opacity?: number
  minHeight?: number
  sampling?: number
  smoothing?: number
  flattening?: number
}

/**
 * 热力图数据点，time 单位为秒，value 为热度值
 */
export interface HeatmapPoint {
  time: number
  value: number
}

/**
 * 弹幕数据源
 */
export type DanmakuSource
  = | UniChunk
    | Iterable<UDanmaku>
    | string
    | File
    | {
      /**
       * 弹幕文件 URL
       */
      url: string

      /**
       * 用于格式识别的文件名
       */
      filename?: string

      /**
       * 用于格式识别的文件扩展名
       */
      ext?: string

      /**
       * fetch 请求配置
       */
      init?: RequestInit

      /**
       * 当前数据源专用的格式识别处理器列表
       */
      handlerList?: HandlerList
    }
    | {
      /**
       * 本地弹幕文件
       */
      file: File

      /**
       * 用于格式识别的文件名，默认使用 file.name
       */
      filename?: string

      /**
       * 用于格式识别的文件扩展名
       */
      ext?: string

      /**
       * 当前数据源专用的格式识别处理器列表
       */
      handlerList?: HandlerList
    }
    | {
      /**
       * 原始弹幕数据
       */
      data: unknown

      /**
       * 用于格式识别的文件名
       */
      filename?: string

      /**
       * 用于格式识别的文件扩展名
       */
      ext?: string

      /**
       * 当前数据源专用的格式识别处理器列表
       */
      handlerList?: HandlerList
    }

/**
 * 弹幕输入，支持直接数据源、Promise 或异步函数
 */
export type DanmakuInput
  = | DanmakuSource
    | Promise<DanmakuSource>
    | (() => DanmakuSource | Promise<DanmakuSource>)

export interface RendererContext {
  /**
   * ArtPlayer 实例
   */
  art: Artplayer

  /**
   * 弹幕插件配置
   */
  option: Option
}

export interface Renderer {
  /**
   * 载入弹幕数据
   */
  load?: (udanmakus: UDanmaku[]) => unknown

  /**
   * 实时改变渲染器配置
   */
  config?: (option: Option) => unknown

  /**
   * 隐藏弹幕层
   */
  hide?: () => unknown

  /**
   * 显示弹幕层
   */
  show?: () => unknown

  /**
   * 重置弹幕
   */
  reset?: () => unknown

  /**
   * 销毁渲染器
   */
  destroy?: () => unknown

  /**
   * 是否隐藏弹幕层
   */
  isHide?: boolean

  /**
   * 是否弹幕层停止状态
   */
  isStop?: boolean
}

export interface Option {
  /**
   * 弹幕数据源(任意@dan-uni/dan-any支持的格式，详细输入类型见 DanmakuInput)，如果不提供则默认为空弹幕
   */
  danmuku?: DanmakuInput

  /**
   * 默认格式识别处理器列表
   */
  handlerList?: HandlerList

  /**
   * 载入弹幕后按顺序执行的 dan-any Plugin 列表，返回 UniChunk 时后续 Plugin 会基于该结果继续执行
   */
  plugins?: PluginList

  /**
   * 弹幕持续时间，范围在[1 ~ 10]
   */
  speed?: number

  /**
   * 弹幕上下边距，支持像素数字和百分比
   */
  margin?: [number | `${number}%`, number | `${number}%`]

  /**
   * 弹幕透明度，范围在[0 ~ 1]
   */
  opacity?: number

  /**
   * 默认弹幕颜色，支持 CSS 颜色字符串、数字字符串和 number 类型颜色值，可以被单独弹幕项覆盖
   */
  color?: Color

  /**
   * 弹幕可见的模式
   */
  modes?: Mode[]

  /**
   * 弹幕字体大小，支持像素数字、百分比和源文件字号
   */
  fontSize?: number | `${number}%` | 'source'

  /**
   * 弹幕是否防重叠
   */
  antiOverlap?: boolean

  /**
   * 是否同步播放速度
   */
  synchronousPlayback?: boolean

  /**
   * 弹幕控制面板挂载点，默认为播放器控制栏左侧
   */
  mount?: HTMLDivElement | string

  /**
   * 是否开启弹幕热力图
   */
  heatmap?: boolean | HeatmapOption

  /**
   * 热力图数据，time 单位为秒；不传或为空时会根据已加载弹幕自动生成
   */
  points?: HeatmapPoint[]

  /**
   * 弹幕是否可见
   */
  visible?: boolean

  /**
   * 是否显示弹幕控制面板
   */
  emitter?: boolean

  /**
   * 保留的输入长度配置，当前插件不提供发送控件
   */
  maxLength?: number

  /**
   * 当播放器宽度小于此值时，控制面板置于播放器底部
   */
  width?: number

  /**
   * 弹幕载入前的过滤器，只支持返回布尔值
   */
  filter?: (danmaku: UDanmaku) => boolean

  /**
   * 弹幕显示前的过滤器，支持返回 Promise
   */
  beforeVisible?: (danmaku: UDanmaku) => boolean | Promise<boolean>

  /**
   * 自定义弹幕渲染器
   */
  renderer?: Renderer | ((context: RendererContext) => Renderer)
}

export interface Result {
  name: 'artplayerPluginDanAny'

  /**
   * 重载弹幕源，或者切换新弹幕
   */
  load: (danmuku?: DanmakuInput) => Promise<Result>

  /**
   * 实时改变弹幕配置
   */
  config: (option: Partial<Option>) => Result

  /**
   * 隐藏弹幕层
   */
  hide: () => Result

  /**
   * 显示弹幕层
   */
  show: () => Result

  /**
   * 重置弹幕
   */
  reset: () => Result

  /**
   * 挂载弹幕控制面板
   */
  mount: (el?: HTMLDivElement | string) => void

  /**
   * 当前弹幕数据块
   */
  chunk: UniChunk | null

  /**
   * 当前载入的 DanUni 弹幕列表
   */
  udanmakus: UDanmaku[]

  /**
   * 弹幕配置
   */
  option: Option

  /**
   * 是否隐藏弹幕层
   */
  isHide: boolean

  /**
   * 是否弹幕层停止状态
   */
  isStop: boolean
}

declare const artplayerPluginDanAny: (option?: Option) => (art: Artplayer) => Result

export default artplayerPluginDanAny
