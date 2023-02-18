export = Artplayer;
export as namespace Artplayer;

declare class Artplayer extends Player {
    constructor(option: Option, readyCallback?: (this: Artplayer, art: Artplayer) => unknown);

    static readonly instances: Artplayer[];
    static readonly version: string;
    static readonly env: string;
    static readonly build: string;
    static readonly config: Config;
    static readonly utils: Utils;
    static readonly scheme: Record<keyof Option, any>;
    static readonly Emitter: Function;
    static readonly validator: <T extends object>(option: T, scheme: object) => T;
    static readonly kindOf: (item: any) => string;
    static readonly html: Artplayer['template']['html'];
    static readonly option: Option;

    static DEBUG: boolean;
    static CONTEXTMENU: boolean;
    static NOTICE_TIME: number;
    static SETTING_WIDTH: number;
    static SETTING_ITEM_WIDTH: number;
    static SETTING_ITEM_HEIGHT: number;
    static INDICATOR_SIZE: number;
    static INDICATOR_SIZE_ICON: number;
    static INDICATOR_SIZE_MOBILE: number;
    static INDICATOR_SIZE_MOBILE_ICON: number;
    static VOLUME_PANEL_WIDTH: number;
    static VOLUME_HANDLE_WIDTH: number;
    static RESIZE_TIME: number;
    static SCROLL_TIME: number;
    static SCROLL_GAP: number;
    static AUTO_PLAYBACK_MAX: number;
    static AUTO_PLAYBACK_MIN: number;
    static RECONNECT_TIME_MAX: number;
    static RECONNECT_SLEEP_TIME: number;
    static CONTROL_HIDE_TIME: number;
    static DB_CLICE_TIME: number;
    static MOBILE_AUTO_PLAYBACKRAT: number;
    static MOBILE_AUTO_PLAYBACKRATE_TIME: number;
    static MOBILE_AUTO_ORIENTATION_TIME: number;
    static INFO_LOOP_TIME: number;
    static FAST_FORWARD_VALUE: number;
    static FAST_FORWARD_TIME: number;
    static TOUCH_MOVE_RATIO: number;
    static VOLUME_STEP: number;
    static SEEK_STEP: number;
    static PROGRESS_HEIGHT: number;
    static PLAYBACK_RATE: number[];
    static ASPECT_RATIO: string[];
    static FLIP: string[];
    static FULLSCREEN_WEB_IN_BODY: boolean;

    readonly id: number;
    readonly option: Option;
    readonly isLock: boolean;
    readonly isReady: boolean;
    readonly isFocus: boolean;
    readonly isInput: boolean;
    readonly isRotate: boolean;
    readonly isDestroy: boolean;

    on<T extends keyof Events>(name: T, fn: (...args: Events[T]) => unknown, ctx?: object): unknown;
    once<T extends keyof Events>(name: T, fn: (...args: Events[T]) => unknown, ctx?: object): unknown;
    emit<T extends keyof Events>(name: T, ...args: unknown[]): unknown;
    off<T extends keyof Events>(name: T, callback?: Function): unknown;

    query: Artplayer['template']['query'];
    proxy: Artplayer['events']['proxy'];
    video: Artplayer['template']['$video'];

    e: Record<keyof Events, { fn: Function; ctx: unknown }[]>;

    destroy(removeHtml?: boolean): void;

    readonly whitelist: {
        get state(): boolean;
    };

    readonly template: {
        get html(): string;
        query(str: string): HTMLElement;
    } & Template;

    readonly events: {
        proxy<KW extends keyof WindowEventMap, KH extends keyof HTMLElementEventMap>(
            element: HTMLDivElement | Document | Window,
            eventName: KW | KH,
            handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event) => void,
            options?: boolean | AddEventListenerOptions,
        ): () => void;
        hover(element: HTMLElement, mouseenter?: (event: Event) => any, mouseleave?: (event: Event) => any): void;
        loadImg(element: HTMLImageElement | string): Promise<HTMLImageElement>;
    };

    readonly storage: {
        name: String;
        settings: Record<string, any>;
        get(key: string): any;
        set(key: string, value: any): void;
        del(key: string): boolean;
        clear(): void;
    };

    readonly icons: Icons;

    readonly i18n: {
        readonly languages: I18n;
        get(key: string): string;
        update(language: Partial<I18n>): void;
    };

    readonly notice: {
        time: number;
        set show(msg: string);
    };

    readonly layers: Record<string, HTMLElement> & Component;

    readonly controls: Record<string, HTMLElement> & Component;

    readonly contextmenu: Record<string, HTMLElement> & Component;

    readonly subtitle: {
        get url(): string;
        set url(url: string);
        style(name: string | Partial<CSSStyleDeclaration>, value?: string): void;
        switch(url: string, option?: Subtitle): Promise<string>;
    } & Component;

    readonly info: Component;

    readonly loading: Component;

    readonly hotkey: {
        keys: Record<string, ((event: Event) => any)[]>;
        add(key: number, callback: (this: Artplayer, event: Event) => any): Artplayer['hotkey'];
    };

    readonly mask: Component;

    readonly setting: {
        option: Setting[];
        add(setting: Setting): SettingOption;
        update(): SettingOption[];
        updateStyle(width?: number): void;
    } & Component;

    readonly plugins: {
        add(plugin: (this: Artplayer, art: Artplayer) => unknown): Artplayer['plugins'];
        [pluginName: string]: any;
    };
}



export type Selector = {
    /**
     * Whether the default is selected
     */
    default?: boolean;

    /**
     * Html string of selector
     */
    html: string | HTMLElement;
};

export type Component = {
    /**
     * Component self-increasing id
     */
    readonly id: number;

    /**
     * Component parent name
     */
    readonly name: string | void;

    /**
     * Component parent element
     */
    readonly $parent: HTMLElement | void;

    /**
     * Whether to show component parent
     */
    get show(): boolean;

    /**
     * Whether to show component parent
     */
    set show(state: boolean);

    /**
     * Toggle the component parent
     */
    set toggle(state: boolean);

    /**
     * Dynamic add a component
     */
    add(option: ComponentOption): HTMLElement;
};

export type ComponentOption = {
    /**
     * Html string or html element of component
     */
    html: string | HTMLElement;

    /**
     * Whether to disable component
     */
    disable?: boolean;

    /**
     * Unique name for component
     */
    name?: string;

    /**
     * Component sort index
     */
    index?: number;

    /**
     * Component style object
     */
    style?: Partial<CSSStyleDeclaration>;

    /**
     * Component click event
     */
    click?(this: Artplayer, component: Component, event: Event): void;

    /**
     * Wnen the component was mounted
     */
    mounted?(this: Artplayer, element: HTMLElement): void;

    /**
     * Component tooltip, use in controls
     */
    tooltip?: string;

    /**
     * Component position, use in controls
     */
    position?: 'top' | 'left' | 'right' | (string & Record<never, never>);

    /**
     * Custom selector list, use in controls
     */
    selector?: Selector[];

    /**
     * When selector item click, use in controls
     */
    onSelect?(this: Artplayer, selector: Selector, element: HTMLElement, event: Event): void;
};

export type Config = {
    propertys: [
        'audioTracks',
        'autoplay',
        'buffered',
        'controller',
        'controls',
        'crossOrigin',
        'currentSrc',
        'currentTime',
        'defaultMuted',
        'defaultPlaybackRate',
        'duration',
        'ended',
        'error',
        'loop',
        'mediaGroup',
        'muted',
        'networkState',
        'paused',
        'playbackRate',
        'played',
        'preload',
        'readyState',
        'seekable',
        'seeking',
        'src',
        'startDate',
        'textTracks',
        'videoTracks',
        'volume',
    ];
    methods: ['addTextTrack', 'canPlayType', 'load', 'play', 'pause'];
    events: [
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'seeked',
        'seeking',
        'stalled',
        'suspend',
        'timeupdate',
        'volumechange',
        'waiting',
    ];
    prototypes: [
        'width',
        'height',
        'videoWidth',
        'videoHeight',
        'poster',
        'webkitDecodedFrameCount',
        'webkitDroppedFrameCount',
        'playsInline',
        'webkitSupportsFullscreen',
        'webkitDisplayingFullscreen',
        'onenterpictureinpicture',
        'onleavepictureinpicture',
        'disablePictureInPicture',
        'cancelVideoFrameCallback',
        'requestVideoFrameCallback',
        'getVideoPlaybackQuality',
        'requestPictureInPicture',
        'webkitEnterFullScreen',
        'webkitEnterFullscreen',
        'webkitExitFullScreen',
        'webkitExitFullscreen',
    ];
};




export type Events = {
    'video:canplay': [event: Event];
    'video:canplaythrough': [event: Event];
    'video:complete': [event: Event];
    'video:durationchange': [event: Event];
    'video:emptied': [event: Event];
    'video:ended': [event: Event];
    'video:error': [event: Error];
    'video:loadeddata': [event: Event];
    'video:loadedmetadata': [event: Event];
    'video:pause': [event: Event];
    'video:play': [event: Event];
    'video:playing': [event: Event];
    'video:progress': [event: Event];
    'video:ratechange': [event: Event];
    'video:seeked': [event: Event];
    'video:seeking': [event: Event];
    'video:stalled': [event: Event];
    'video:suspend': [event: Event];
    'video:timeupdate': [event: Event];
    'video:volumechange': [event: Event];
    'video:waiting': [event: Event];
    hotkey: [event: Event];
    destroy: [];
    url: [url: string];
    subtitleUpdate: [text: string];
    subtitleLoad: [url: string];
    subtitleSwitch: [url: string];
    focus: [];
    blur: [];
    dblclick: [];
    click: [];
    hover: [state: boolean, event: Event];
    mousemove: [event: Event];
    resize: [];
    view: [state: boolean];
    lock: [state: boolean];
    aspectRatio: [aspectRatio: AspectRatio];
    autoHeight: [height: number];
    autoSize: [];
    ready: [];
    error: [error: Error, reconnectTime: number];
    flip: [flip: Flip];
    fullscreen: [state: boolean];
    fullscreenWeb: [state: boolean];
    mini: [state: boolean];
    pause: [];
    pip: [state: boolean];
    play: [];
    screenshot: [dataUri: string];
    seek: [currentTime: number];
    subtitleOffset: [offset: number];
    restart: [];
};

type I18nKeys = 'en' | 'zh-cn' | 'zh-tw' | 'pl' | 'cs' | 'es' | 'fa' | 'fr' | (string & Record<never, never>);

type I18nValue = {
    'Video Info': string;
    Close: string;
    'Video Load Failed': string;
    Volume: string;
    Play: string;
    Pause: string;
    Rate: string;
    Mute: string;
    'Video Flip': string;
    Horizontal: string;
    Vertical: string;
    Reconnect: string;
    'Show Setting': string;
    'Hide Setting': string;
    Screenshot: string;
    'Play Speed': string;
    'Aspect Ratio': string;
    Default: string;
    Normal: string;
    Open: string;
    'Switch Video': string;
    'Switch Subtitle': string;
    Fullscreen: string;
    'Exit Fullscreen': string;
    'Web Fullscreen': string;
    'Exit Web Fullscreen': string;
    'Mini Player': string;
    'PIP Mode': string;
    'Exit PIP Mode': string;
    'PIP Not Supported': string;
    'Fullscreen Not Supported': string;
    'Subtitle Offset': string;
    'Last Seen': string;
    'Jump Play': string;
    AirPlay: string;
    'AirPlay Not Available': string;
};

export type I18n = Record<I18nKeys, Partial<I18nValue>>;

export type Icons = {
    readonly loading: HTMLDivElement;
    readonly state: HTMLDivElement;
    readonly play: HTMLDivElement;
    readonly pause: HTMLDivElement;
    readonly check: HTMLDivElement;
    readonly volume: HTMLDivElement;
    readonly volumeClose: HTMLDivElement;
    readonly screenshot: HTMLDivElement;
    readonly setting: HTMLDivElement;
    readonly pip: HTMLDivElement;
    readonly arrowLeft: HTMLDivElement;
    readonly arrowRight: HTMLDivElement;
    readonly playbackRate: HTMLDivElement;
    readonly aspectRatio: HTMLDivElement;
    readonly config: HTMLDivElement;
    readonly lock: HTMLDivElement;
    readonly flip: HTMLDivElement;
    readonly unlock: HTMLDivElement;
    readonly fullscreenOff: HTMLDivElement;
    readonly fullscreenOn: HTMLDivElement;
    readonly fullscreenWebOff: HTMLDivElement;
    readonly fullscreenWebOn: HTMLDivElement;
    readonly switchOn: HTMLDivElement;
    readonly switchOff: HTMLDivElement;
    readonly error: HTMLDivElement;
    readonly close: HTMLDivElement;
    readonly airplay: HTMLDivElement;
    readonly [key: string]: HTMLDivElement;
};








type CustomType = 'flv' | 'm3u8' | 'hls' | 'ts' | 'mpd' | 'torrent' | (string & Record<never, never>);

export type Option = {
    /**
     * The player id
     */
    id?: string;

    /**
     * The container mounted by the player
     */
    container: string | HTMLDivElement;

    /**
     * Video url
     */
    url: string;

    /**
     * Video poster image url
     */
    poster?: string;

    /**
     * Video title
     */
    title?: string;

    /**
     * Video url type
     */
    type?: CustomType;

    /**
     * Player color theme
     */
    theme?: string;

    /**
     * Player language
     */
    lang?: keyof I18n;

    /**
     * Player default volume
     */
    volume?: number;

    /**
     * Whether live broadcast mode
     */
    isLive?: boolean;

    /**
     * Whether video muted
     */
    muted?: boolean;

    /**
     * Whether video auto play
     */
    autoplay?: boolean;

    /**
     * Whether player auto resize
     */
    autoSize?: boolean;

    /**
     * Whether player auto run mini mode
     */
    autoMini?: boolean;

    /**
     * Whether video auto loop
     */
    loop?: boolean;

    /**
     * Whether show video flip button
     */
    flip?: boolean;

    /**
     * Whether show video playback rate button
     */
    playbackRate?: boolean;

    /**
     * Whether show video aspect ratio button
     */
    aspectRatio?: boolean;

    /**
     * Whether show video screenshot button
     */
    screenshot?: boolean;

    /**
     * Whether show video setting button
     */
    setting?: boolean;

    /**
     * Whether to enable player hotkey
     */
    hotkey?: boolean;

    /**
     * Whether show video pip button
     */
    pip?: boolean;

    /**
     * Do you want to run only one player at a time
     */
    mutex?: boolean;

    /**
     * Whether use backdrop in UI
     */
    backdrop?: boolean;

    /**
     * Whether show video window fullscreen button
     */
    fullscreen?: boolean;

    /**
     * Whether show video web fullscreen button
     */
    fullscreenWeb?: boolean;

    /**
     * Whether to enable player subtitle offset
     */
    subtitleOffset?: boolean;

    /**
     * Whether to enable player mini progress bar
     */
    miniProgressBar?: boolean;

    /**
     * Whether use SSR function
     */
    useSSR?: boolean;

    /**
     * Whether use playsInline in mobile
     */
    playsInline?: boolean;

    /**
     * Whether use lock in mobile
     */
    lock?: boolean;

    /**
     * Whether use fast forward in mobile
     */
    fastForward?: boolean;

    /**
     * Whether use auto playback
     */
    autoPlayback?: boolean;

    /**
     * Whether use auto orientation in mobile
     */
    autoOrientation?: boolean;

    /**
     * Whether use airplay
     */
    airplay?: boolean;

    /**
     * Custom plugin list
     */
    plugins?: ((this: Artplayer, art: Artplayer) => unknown)[];

    /**
     * Custom mobile whitelist
     */
    whitelist?: (string | ((ua: string) => boolean) | RegExp)[];

    /**
     * Custom layer list
     */
    layers?: ComponentOption[];

    /**
     * Custom contextmenu list
     */
    contextmenu?: ComponentOption[];

    /**
     * Custom control list
     */
    controls?: ComponentOption[];

    /**
     * Custom setting list
     */
    settings?: Setting[];

    /**
     * Custom video quality list
     */
    quality?: {
        /**
         * Whether the default is selected
         */
        default?: boolean;

        /**
         * Html string of quality
         */
        html: string | HTMLElement;

        /**
         * Video quality url
         */
        url: string;
    }[];

    /**
     * Custom highlight list
     */
    highlight?: {
        /**
         * The highlight time
         */
        time: number;

        /**
         * The highlight text
         */
        text: string;
    }[];

    /**
     * Custom thumbnail
     */
    thumbnails?: {
        /**
         * The thumbnail image url
         */
        url: string;

        /**
         * The thumbnail item number
         */
        number?: number;

        /**
         * The thumbnail column size
         */
        column?: number;

        /**
         * The thumbnail width
         */
        width?: number;

        /**
         * The thumbnail height
         */
        height?: number;
    };

    /**
     * Custom subtitle option
     */
    subtitle?: Subtitle;

    /**
     * Other video attribute
     */
    moreVideoAttr?: Partial<{
        [key in keyof HTMLVideoElement as HTMLVideoElement[key] extends Function ? never : key]: HTMLVideoElement[key];
    }>;

    /**
     * Custom i18n
     */
    i18n?: I18n;

    /**
     * Custom default icons
     */
    icons?: {
        [key in keyof Icons]?: HTMLElement | string;
    };

    /**
     * Custom video type function
     */
    customType?: Partial<
        Record<CustomType, (this: Artplayer, video: HTMLVideoElement, url: string, art: Artplayer) => any>
    >;
};

export default Option;

export type AspectRatio = 'default' | '4:3' | '16:9' | (string & Record<never, never>);
export type PlaybackRate = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | (number & Record<never, never>);
export type Flip = 'normal' | 'horizontal' | 'vertical' | (string & Record<never, never>);

export declare class Player {
    get aspectRatio(): AspectRatio;
    set aspectRatio(ratio: AspectRatio);
    get playbackRate(): PlaybackRate;
    set playbackRate(rate: PlaybackRate);
    get autoSize(): boolean;
    set autoSize(state: boolean);
    get autoHeight(): boolean;
    set autoHeight(state: boolean);
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
    get title(): string;
    set title(title: string);
    get theme(): string;
    set theme(theme: string);
    get subtitleOffset(): number;
    set subtitleOffset(time: number);
    pause(): void;
    play(): Promise<void>;
    toggle(): void;
    attr(key: string, value?: any): unknown;
    switchUrl(url: string): Promise<string>;
    switchQuality(url: string): Promise<string>;
    getDataURL(): Promise<string>;
    getBlobUrl(): Promise<string>;
    screenshot(): Promise<string>;
    airplay(): void;
}



type Props<T> = {
    html: string;
    icon: string;
    tooltip: string;
    $icon: HTMLDivElement;
    $html: HTMLDivElement;
    $tooltip: HTMLDivElement;
    $switch: boolean;
    $range: HTMLInputElement;
    $parentItem: Setting;
    $parentList: Setting[];
} & Omit<T, 'html' | 'icon' | 'tooltip'>;

export type SettingOption = Props<Setting>;

export type Setting = {
    /**
     * Html string or html element of setting name
     */
    html: string | HTMLElement;

    /**
     * Html string or html element of setting icon
     */
    icon?: string | HTMLElement;

    /**
     * The width of setting
     */
    width?: number;

    /**
     * The tooltip of setting
     */
    tooltip?: string | HTMLElement;

    /**
     * Whether the default is selected
     */
    default?: boolean;

    /**
     * Custom selector list
     */
    selector?: Setting[];

    /**
     * Wnen the setting was mounted
     */
    mounted?(this: Artplayer, panel: HTMLDivElement, item: Setting): void;

    /**
     * When selector item click
     */
    onSelect?(this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event): void;

    /**
     * Custom switch item
     */
    switch?: boolean;

    /**
     * When switch item click
     */
    onSwitch?(this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event): void;

    /**
     * Custom range item
     */
    range?: [value?: number, min?: number, max?: number, step?: number];

    /**
     * When range item change
     */
    onRange?(this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event): void;

    /**
     * When range item change in real time
     */
    onChange?(this: Artplayer, item: SettingOption, element: HTMLDivElement, event: Event): void;

    [key: string]: any;
};

export type Subtitle = {
    /**
     * The subtitle url
     */
    url?: string;

    /**
     * The subtitle name
     */
    name?: string;

    /**
     * The subtitle type
     */
    type?: 'vtt' | 'srt' | 'ass' | (string & Record<never, never>);

    /**
     * The subtitle style object
     */
    style?: Partial<CSSStyleDeclaration>;

    /**
     * The subtitle encoding, default utf-8
     */
    encoding?: string;

    /**
     * Whether use escape, default true
     */
    escape?: boolean;
};

export type Template = {
    readonly $container: HTMLDivElement;
    readonly $original: HTMLDivElement;
    readonly $player: HTMLDivElement;
    readonly $video: HTMLVideoElement;
    readonly $track: HTMLTrackElement;
    readonly $poster: HTMLDivElement;
    readonly $subtitle: HTMLDivElement;
    readonly $danmuku: HTMLDivElement;
    readonly $bottom: HTMLDivElement;
    readonly $progress: HTMLDivElement;
    readonly $controls: HTMLDivElement;
    readonly $controlsLeft: HTMLDivElement;
    readonly $controlsRight: HTMLDivElement;
    readonly $layer: HTMLDivElement;
    readonly $loading: HTMLDivElement;
    readonly $notice: HTMLDivElement;
    readonly $noticeInner: HTMLDivElement;
    readonly $mask: HTMLDivElement;
    readonly $state: HTMLDivElement;
    readonly $setting: HTMLDivElement;
    readonly $info: HTMLDivElement;
    readonly $infoPanel: HTMLDivElement;
    readonly $infoClose: HTMLDivElement;
    readonly $miniHeader: HTMLDivElement;
    readonly $miniTitle: HTMLDivElement;
    readonly $miniClose: HTMLDivElement;
    readonly $contextmenu: HTMLDivElement;
};

export type Utils = {
    userAgent: string;
    isMobile: boolean;
    isSafari: boolean;
    isWechat: boolean;
    isIE: boolean;
    isAndroid: boolean;
    isIOS: boolean;
    query(selector: string, parent?: HTMLElement): HTMLElement;
    queryAll(selector: string, parent?: HTMLElement): HTMLElement[];
    addClass(target: HTMLElement, className: string): void;
    removeClass(target: HTMLElement, className: string): void;
    hasClass(target: HTMLElement, className: string): boolean;
    append(target: HTMLElement, className: HTMLElement): HTMLElement;
    remove(target: HTMLElement): void;
    setStyle<T extends keyof CSSStyleDeclaration>(
        element: HTMLElement,
        key: T,
        value: CSSStyleDeclaration[T],
    ): HTMLElement;
    setStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): HTMLElement;
    getStyle<T, K extends keyof CSSStyleDeclaration>(
        element: HTMLElement,
        key: K,
        numberType?: T,
    ): T extends true ? number : string;
    sublings(target: HTMLElement): HTMLElement[];
    inverseClass(target: HTMLElement, className: string): void;
    tooltip(target: HTMLElement, msg: string, pos?: string): void;
    isInViewport(target: HTMLElement, offset?: number): boolean;
    includeFromEvent(event: Event, target: HTMLElement): boolean;
    replaceElement(newChild: HTMLElement, oldChild: HTMLElement): HTMLElement;
    createElement(tag: keyof HTMLElementTagNameMap): HTMLElement;
    errorHandle<T extends boolean>(condition: T, msg: string): T extends true ? T : never;
    srtToVtt(srtText: string): string;
    vttToBlob(vttText: string): string;
    assToVtt(assText: string): string;
    getExt(url: string): string;
    download(url: string, name: string): void;
    def(obj: object, name: string, value: any): void;
    has(obj: object, name: string): boolean;
    get(obj: object, name: string): PropertyDescriptor;
    mergeDeep<T>(...args: T[]): T;
    sleep(ms: number): Promise<null>;
    debounce(func: (...arg: any[]) => any, wait: number, context?: object): (...arg: any[]) => any;
    throttle(func: (...arg: any[]) => any, wait: number): (...arg: any[]) => any;
    clamp(num: number, a: number, b: number): number;
    secondToTime(second: number): string;
    escape(str: string): string;
    capitalize(str: string): string;
    isStringOrNumber(val: any): boolean;
};