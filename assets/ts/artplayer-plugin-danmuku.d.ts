import type Artplayer from 'artplayer';

export = artplayerPluginDanmuku;
export as namespace artplayerPluginDanmuku;

type Mode = 0 | 1 | 2;

type Danmu = {
    /**
     * 弹幕文本
     */
    text: string;

    /**
     * 弹幕发送模式: 0: 滚动，1: 顶部，2: 底部
     */
    mode?: Mode;

    /**
     * 弹幕颜色
     */
    color?: string;

    /**
     * 弹幕出现的时间，单位为秒
     */
    time?: number;

    /**
     * 弹幕是否有描边, 默认为 false
     */
    border?: boolean;

    /**
     * 弹幕自定义样式
     */
    style?: Partial<CSSStyleDeclaration>;

    /**
     * 弹幕文本是否转义, 默认为 true
     */
    escape?: boolean;
};

type Option = {
    /**
     * 弹幕数据: 函数，数组，Promise，URL
     */
    danmuku: Danmu[] | string | (() => Promise<Danmu[]>) | Promise<Danmu[]>;

    /**
     * 弹幕持续时间，范围在[1 ~ 10]
     */
    speed?: number;

    /**
     * 弹幕上下边距，支持像素数字和百分比
     */
    margin?: [number | `${number}%`, number | `${number}%`];

    /**
     * 弹幕透明度，范围在[0 ~ 1]
     */
    opacity?: number;

    /**
     * 默认弹幕颜色，可以被单独弹幕项覆盖
     */
    color?: string;

    /**
     * 弹幕模式: 0: 滚动，1: 顶部，2: 底部
     */
    mode?: Mode;

    /**
     * 弹幕可见的模式
     */
    modes?: Mode[];

    /**
     * 弹幕字体大小，支持像素数字和百分比
     */
    fontSize?: number | `${number}%`;

    /**
     * 弹幕是否防重叠
     */
    antiOverlap?: boolean;

    /**
     * 是否同步播放速度
     */
    synchronousPlayback?: boolean;

    /**
     * 弹幕发射器挂载点, 默认为播放器控制栏中部
     */
    mount?: HTMLDivElement | string;

    /**
     * 是否开启弹幕热度图
     */
    heatmap?:
        | boolean
        | {
              xMin?: number;
              xMax?: number;
              yMin?: number;
              yMax?: number;
              scale?: number;
              opacity?: number;
              minHeight?: number;
              sampling?: number;
              smoothing?: number;
              flattening?: number;
          };

    /**
     * 热力图数据
     */
    points?: any[];

    /**
     * 弹幕载入前的过滤器，只支持返回布尔值
     */
    filter?: (danmu: Danmu) => boolean;

    /**
     * 弹幕发送前的过滤器，支持返回 Promise
     */
    beforeEmit?: (danmu: Danmu) => boolean | Promise<boolean>;

    /**
     * 弹幕显示前的过滤器，支持返回 Promise
     */
    beforeVisible?: (danmu: Danmu) => boolean | Promise<boolean>;

    /**
     * 弹幕是否可见
     */
    visible?: boolean;

    /**
     * 弹幕输入框最大长度, 范围在[1 ~ 1000]
     */
    maxLength?: number;

    /**
     * 输入框锁定时间，范围在[1 ~ 60]
     */
    lockTime?: number;

    /**
     * 弹幕主题，只在自定义挂载时生效
     */
    theme?: 'light' | 'dark';
};

type Danmuku = {
    name: 'artplayerPluginDanmuku';

    /**
     * 发送一条实时弹幕
     */
    emit: (danmu: Danmu) => Danmuku;

    /**
     * 重载弹幕源，或者切换新弹幕
     */
    load: () => Promise<Danmuku>;

    /**
     * 实时改变弹幕配置
     */
    config: (option: Option) => Danmuku;

    /**
     * 隐藏弹幕层
     */
    hide: () => Danmuku;

    /**
     * 显示弹幕层
     */
    show: () => Danmuku;

    /**
     * 挂载弹幕输入框
     */
    mount: (el?: HTMLDivElement | string) => void;

    /**
     * 重置弹幕
     */
    reset: () => Danmuku;

    /**
     * 弹幕配置
     */
    option: Option;

    /**
     * 是否隐藏弹幕层
     */
    isHide: boolean;

    /**
     * 是否弹幕层停止状态
     */
    isStop: boolean;
};

declare const artplayerPluginDanmuku: (option: Option) => (art: Artplayer) => Danmuku;
