export = Artplayer;

interface ComponentOption {
    html: string | HTMLElement;
    disable?: boolean;
    name?: string;
    index?: number;
    style?: object;
    click?: Function;
    mounted?: Function;
    tooltip?: string;
    position?: 'top' | 'left' | 'right';
    selector?: {
        default?: boolean;
        html: string;
    }[];
    onSelect?: Function;
}

interface Component {
    readonly id: number;
    readonly name: string | void;
    readonly $parent: HTMLElement | void;
    get show(): boolean;
    set show(state: boolean);
    set toggle(state: boolean);
    add(option: ComponentOption): HTMLElement;
}

interface Option {
    container: string | HTMLElement;
    url: string;
    poster?: string;
    title?: string;
    type?: string;
    theme?: string;
    lang?: 'en' | 'zh-cn' | 'zh-tw';
    volume?: number;
    isLive?: boolean;
    muted?: boolean;
    autoplay?: boolean;
    autoSize?: boolean;
    autoMini?: boolean;
    loop?: boolean;
    flip?: boolean;
    rotate?: boolean;
    playbackRate?: boolean;
    aspectRatio?: boolean;
    screenshot?: boolean;
    setting?: boolean;
    hotkey?: boolean;
    pip?: boolean;
    mutex?: boolean;
    backdrop?: boolean;
    fullscreen?: boolean;
    fullscreenWeb?: boolean;
    subtitleOffset?: boolean;
    miniProgressBar?: boolean;
    localVideo?: boolean;
    localSubtitle?: boolean;
    useSSR?: boolean;
    plugins?: Function[];
    whitelist?: (string | Function | RegExp)[];
    layers?: ComponentOption[];
    contextmenu?: ComponentOption[];
    controls?: ComponentOption[];
    settings?: ComponentOption[];
    quality?: {
        default?: boolean;
        html: string;
        url: string;
    }[];
    highlight?: {
        time: number;
        text: string;
    }[];
    thumbnails?: {
        url: string;
        number?: number;
        width?: number;
        height?: number;
        column?: number;
    };
    subtitle?: {
        url: string;
        style: object;
        encoding: string;
        bilingual: boolean;
    };
    moreVideoAttr?: object;
    icons?: {
        [propName: string]: string | HTMLElement;
    };
    customType?: {
        [propName: string]: Function;
    };
}

type AspectRatio = 'default' | '4:3' | '16:9' | void;
type PlaybackRate = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | void;
type Rotate = -270 | -180 | -90 | 0 | 90 | 180 | 270 | void;
type Flip = 'normal' | 'horizontal' | 'vertical' | void;

declare class Player {
    get aspectRatio(): AspectRatio;
    set aspectRatio(ratio: AspectRatio);
    get playbackRate(): PlaybackRate;
    set playbackRate(rate: PlaybackRate);
    get rotate(): Rotate;
    set rotate(deg: Rotate);
    get autoSize(): boolean;
    set autoSize(state: boolean);
    get currentTime(): number;
    set currentTime(time: number);
    get duration(): number;
    get played(): number;
    get playing(): boolean;
    get flip(): Flip;
    set flip(state: Flip);
    get fullscreen(): boolean;
    set fullscreen(state: boolean);
    set fullscreenToggle(state: boolean);
    get fullscreenWeb(): boolean;
    set fullscreenWeb(state: boolean);
    set fullscreenWebToggle(state: boolean);
    get loaded(): number;
    get loop(): number[];
    set loop(value: number[]);
    get mini(): boolean;
    set mini(state: boolean);
    get pip(): boolean;
    set pip(state: boolean);
    get poster(): string;
    set poster(url: string);
    get rect(): DOMRect;
    get bottom(): number;
    get height(): number;
    get left(): number;
    get right(): number;
    get top(): number;
    get width(): number;
    get x(): number;
    get y(): number;
    set seek(time: number);
    set forward(time: number);
    set backward(time: number);
    get url(): string;
    set url(url: string);
    get volume(): number;
    set volume(percentage: number);
    get muted(): boolean;
    set muted(state: boolean);
    pause(): any;
    play(): any;
    toggle(): any;
    switchUrl(): Promise<string>;
    switchQuality(): Promise<string>;
    getDataURL(): Promise<string>;
    getBlobUrl(): Promise<string>;
    screenshot(): Promise<string>;
}

declare class Artplayer extends Player {
    constructor(option: Option);

    static instances: Artplayer[];
    static version: string;
    static env: string;
    static build: string;
    static config: object;
    static utils: object;
    static scheme: object;
    static Emitter: Function;
    static validator: Function;
    static kindOf: Function;
    static html: string;
    static option: Option;

    readonly id: number;
    readonly option: Option;
    readonly isFocus: boolean;
    readonly isDestroy: boolean;
    readonly userAgent: string;
    readonly isMobile: boolean;
    readonly isWechat: boolean;

    on(name: string, fn: Function, ctx?: object): void;
    once(name: string, fn: Function, ctx?: object): void;
    emit(name: string): void;
    off(name: string, callback?: Function): void;
    query(selector: string): HTMLElement;
    proxy(target: HTMLElement, name: string, callback: Function, option?: object): Function;
    destroy(removeHtml?: boolean): void;

    readonly template: {
        query(str: string): HTMLElement;
        readonly $container: HTMLElement;
        readonly $original: HTMLElement;
        readonly $player: HTMLElement;
        readonly $video: HTMLElement;
        readonly $poster: HTMLElement;
        readonly $subtitle: HTMLElement;
        readonly $danmuku: HTMLElement;
        readonly $bottom: HTMLElement;
        readonly $progress: HTMLElement;
        readonly $controls: HTMLElement;
        readonly $controlsLeft: HTMLElement;
        readonly $controlsRight: HTMLElement;
        readonly $layer: HTMLElement;
        readonly $loading: HTMLElement;
        readonly $notice: HTMLElement;
        readonly $noticeInner: HTMLElement;
        readonly $mask: HTMLElement;
        readonly $state: HTMLElement;
        readonly $setting: HTMLElement;
        readonly $settingInner: HTMLElement;
        readonly $settingBody: HTMLElement;
        readonly $info: HTMLElement;
        readonly $infoPanel: HTMLElement;
        readonly $infoClose: HTMLElement;
        readonly $miniHeader: HTMLElement;
        readonly $miniTitle: HTMLElement;
        readonly $miniClose: HTMLElement;
        readonly $contextmenu: HTMLElement;
    };

    readonly events: {
        proxy(target: HTMLElement, name: string, callback: Function, option?: object): Function;
        hover(target: HTMLElement, mouseenter?: Function, mouseleave?: Function): Function;
        loadImg(target: HTMLImageElement | string): Promise<HTMLImageElement>;
    };

    readonly whitelist: {
        readonly state: boolean;
    };

    readonly storage: {
        readonly name: string;
        readonly settings: object;
        get(key: string): any;
        set(key: string, value: any): void;
        del(key: string): any;
        clean(): any;
    };

    readonly icons: {
        readonly loading: HTMLElement;
        readonly state: HTMLElement;
        readonly play: HTMLElement;
        readonly pause: HTMLElement;
        readonly volume: HTMLElement;
        readonly volumeClose: HTMLElement;
        readonly subtitle: HTMLElement;
        readonly screenshot: HTMLElement;
        readonly setting: HTMLElement;
        readonly fullscreen: HTMLElement;
        readonly fullscreenWeb: HTMLElement;
        readonly pip: HTMLElement;
    };

    readonly hotkey: {
        add(key: number, event: Function): Artplayer['hotkey'];
    };

    readonly plugins: {
        readonly id: number;
        add(plugin: Function): Artplayer['plugins'];
    };

    readonly i18n: {
        readonly languages: object;
        get(key: string): string;
        update(language: object): void;
    };

    readonly notice: {
        time: number;
        set show(msg: string);
    };

    readonly subtitle: {
        get show(): boolean;
        set show(state: boolean);
        set toggle(state: boolean);
        get url(): string;
        style(name: string | object, value?: string): HTMLElement;
        switch(url: string, option?: object): Promise<string>;
    };

    readonly mobile: object;

    readonly player: Player;

    readonly layers: Component;

    readonly controls: Component;

    readonly contextmenu: Component;

    readonly info: Component;

    readonly loading: Component;

    readonly mask: Component;

    readonly setting: Component;
}
