import type Artplayer from 'artplayer';

export = artplayerPluginDanmuku;
export as namespace artplayerPluginDanmuku;

type Danmu = {
    /**
     * 弹幕文本
     */
    text: string;

    /**
     * 弹幕发送模式: 0: 滚动，1: 顶部，2: 底部
     */
    mode?: 0 | 1 | 2 | 3;

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
     * 弹幕源，可以是弹幕数组，xml 地址或者一个返回 Promise 的函数
     */
    danmuku: Danmu[] | string | (() => Promise<Danmu[]>) | Promise<Danmu[]>;

    /**
     * 弹幕持续时间，单位秒，范围在[1 ~ 10]
     */
    speed?: number;

    /**
     * 弹幕上下边距，支持数字和高度的百分比
     */
    margin?: [number | `${number}%`, number | `${number}%`];

    /**
     * 弹幕透明度，范围在[0 ~ 1]
     */
    opacity?: number;

    /**
     * 默认字体颜色
     */
    color?: string;

    /**
     * 默认弹幕发送模式，0为滚动，1为静止
     */
    mode?: 0 | 1;

    /**
     * 字体大小，支持数字和高度的百分比
     */
    fontSize?: number | `${number}%`;

    /**
     * 弹幕过滤函数，返回 true 则可以发送
     */
    filter?: (danmu: Danmu) => boolean;

    /**
     * 是否防重叠
     */
    antiOverlap?: boolean;

    /**
     * 是否同步到播放速度
     */
    synchronousPlayback?: boolean;

    /**
     * 通过 mount 选项可以自定义输入框挂载的位置，默认挂载于播放器底部，仅在当宽度小于最小值时生效
     */
    mount?: Element | string;

    /**
     * 输入框自定义挂载时的主题色，默认为 dark，可以选填亮色 light
     */
    theme?: 'dark' | 'light';

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
     * 发送弹幕前的自定义校验，返回 true 则可以发送
     */
    beforeEmit?: (danmu: Danmu) => boolean;
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
    mount: () => void;

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
