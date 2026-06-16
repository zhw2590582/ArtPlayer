import type Artplayer from 'artplayer'
import type { Adapter, Metadata, Plugin } from '@dan-uni/dan-any/adapters'
import type { ExtraDanUniMerge, UDanmaku, UniChunk } from '@dan-uni/dan-any/core'

export type { ExtraDanUniMerge }

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
 * 发射器字号选项
 */
export interface EmitterFontSize {
  size: number
  text?: string
}

/**
 * 发射器弹幕位置选项
 */
export interface EmitterMode {
  type: UDanmaku['mode']
  text?: string
}

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
   * 实时发送一条弹幕，只进入当前渲染队列
   */
  emit?: (danmaku: UDanmaku) => unknown

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
   * 类型过滤选项，color 和 count 分别控制是否显示彩色弹幕和计数弹幕（如 B 站的「1条精彩评论」），当某个选项为 false 时会统一使用默认颜色或隐藏计数弹幕
   */
  typeOptions: {
    /**
     * 是否显示彩色弹幕（false 时统一使用默认颜色）
     */
    color: true,
    /**
     * 是否显示计数弹幕
     */
    count: true,
  },

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
   * 发送弹幕的默认字段；UI 发送时会用这些字段补齐完整 UDanmaku
   */
  emitDefaults?: Partial<Omit<UDanmaku, 'ctime' | 'DMID'>>

  /**
   * 发射器字号列表
   */
  emitterFontSizes?: EmitterFontSize[]

  /**
   * 发射器颜色列表，使用 DanUni 的 number 颜色值
   */
  emitterColors?: number[]

  /**
   * 发射器弹幕位置列表
   */
  emitterModes?: EmitterMode[]

  /**
   * 弹幕输入框最大长度，范围在[1 ~ 1000]
   */
  maxLength?: number

  /**
   * 发送后输入框锁定时间，范围在[1 ~ 60]
   */
  lockTime?: number

  /**
   * 当播放器宽度小于此值时，控制面板置于播放器底部
   */
  width?: number

  /**
   * 弹幕载入前的过滤器，只支持返回布尔值
   */
  filter?: (danmaku: UDanmaku) => boolean

  /**
   * 弹幕发送前的过滤器，支持返回 Promise
   */
  beforeEmit?: (danmaku: UDanmaku) => boolean | Promise<boolean>

  /**
   * 弹幕发送处理器，支持返回 Promise；返回 false 时不会进入本地渲染队列
   */
  emit?: (danmaku: UDanmaku) => unknown | Promise<unknown>

  /**
   * 弹幕显示前的过滤器，支持返回 Promise
   */
  beforeVisible?: (danmaku: UDanmaku) => boolean | Promise<boolean>

  /**
   * 自定义弹幕渲染器
   */
  renderer?: Renderer | ((context: RendererContext) => Renderer)

  /**
   * 弹幕点赞回调函数
   */
  onLike?: (danmaku: UDanmaku) => void | Promise<void>

  /**
   * 弹幕举报回调函数
   */
  onReport?: (danmaku: UDanmaku) => void | Promise<void>

  /**
   * 是否启用弹幕点击交互（默认 true）
   */
  enableInteraction?: boolean
}

export interface Result {
  name: 'artplayerPluginDanAny'

  /**
   * 重载弹幕源，或者切换新弹幕
   */
  load: (danmuku?: DanmakuInput) => Promise<Result>

  /**
   * 发送一条完整 UDanmaku，只进入当前渲染队列；progress 为 int32 毫秒
   */
  emit: (danmaku: UDanmaku) => Promise<Result>

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
