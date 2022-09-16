export = Artplayer;
export as namespace Artplayer;

type Selector = {
    /**
     * Whether the default is selected
     */
    default?: boolean;

    /**
     * Html string of selector
     */
    html: string | HTMLElement;
};

type ComponentOption = {
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
    style?: CSSStyleDeclaration;

    /**
     * Component click event
     */
    click?(component: Component, event: Event): void;

    /**
     * Wnen the component was mounted
     */
    mounted?(element: HTMLElement): void;

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
    onSelect?(selector: Selector, element: HTMLElement, event: Event): void;
};

type SettingOption = {
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
    selector?: SettingOption[];

    /**
     * When selector item click
     */
    onSelect?(item: SettingOption, element: HTMLElement, event: Event): void;

    /**
     * Custom switch item
     */
    switch?: boolean;

    /**
     * When switch item click
     */
    onSwitch?(item: SettingOption, element: HTMLElement, event: Event): void;

    /**
     * Custom range item
     */
    range?: number[] | number;

    /**
     * When range item change
     */
    onRange?(item: SettingOption, element: HTMLElement, event: Event): void;

    $icon?: HTMLElement;
    $html?: HTMLElement;
    $tooltip?: HTMLElement;
    $switch?: boolean;
    $range?: HTMLElement;
    $parentItem?: SettingOption;
    $parentList?: SettingOption[];
};

type Component = {
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

type PluginFunction = (art: Artplayer) => any | ((option: any) => (art: Artplayer) => any);
type CustomType = (video: HTMLVideoElement, url: string, art: Artplayer) => any;
type WhitelistFunction = (ua: string) => boolean;
type EventCallback = (event: Event) => any;

type SubtitleOption = {
    /**
     * The subtitle url
     */
    url: string;

    /**
     * The subtitle type
     */
    type?: 'vtt' | 'srt' | 'ass' | (string & Record<never, never>);

    /**
     * The subtitle style object
     */
    style?: CSSStyleDeclaration;

    /**
     * The subtitle encoding, default utf-8
     */
    encoding?: string;
};

type Option = {
    /**
     * The player id
     */
    id: string;

    /**
     * The container mounted by the player
     */
    container: string | HTMLElement;

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
    type?: string;

    /**
     * Player color theme
     */
    theme?: string;

    /**
     * Player language
     */
    lang?: 'en' | 'zh-cn' | 'zh-tw' | 'cs' | 'pl' | 'es' | (string & Record<never, never>);

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
    plugins?: PluginFunction[];

    /**
     * Custom mobile whitelist
     */
    whitelist?: (string | WhitelistFunction | RegExp)[];

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
    settings?: SettingOption[];

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
    subtitle?: SubtitleOption;

    /**
     * Other video attribute
     */
    moreVideoAttr?: HTMLVideoElement;

    /**
     * Custom default icons
     */
    icons?: {
        loading?: HTMLElement | string;
        state?: HTMLElement | string;
        play?: HTMLElement | string;
        pause?: HTMLElement | string;
        volume?: HTMLElement | string;
        volumeClose?: HTMLElement | string;
        subtitle?: HTMLElement | string;
        screenshot?: HTMLElement | string;
        setting?: HTMLElement | string;
        fullscreen?: HTMLElement | string;
        fullscreenWeb?: HTMLElement | string;
        pip?: HTMLElement | string;
        indicator?: HTMLElement | string;
        arrowLeft?: HTMLElement | string;
        arrowRight?: HTMLElement | string;
        playbackRate?: HTMLElement | string;
        aspectRatio?: HTMLElement | string;
        config?: HTMLElement | string;
    };

    /**
     * Custom video type function
     */
    customType?: {
        [key: string]: CustomType;
    };
};

type AspectRatio = 'default' | '4:3' | '16:9' | void;
type PlaybackRate = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | void;
type Flip = 'normal' | 'horizontal' | 'vertical' | void;
type Events =
    | 'video:canplay'
    | 'video:canplaythrough'
    | 'video:complete'
    | 'video:durationchange'
    | 'video:emptied'
    | 'video:ended'
    | 'video:loadeddata'
    | 'video:loadeddata'
    | 'video:loadedmetadata'
    | 'video:pause'
    | 'video:play'
    | 'video:playing'
    | 'video:progress'
    | 'video:ratechange'
    | 'video:seeked'
    | 'video:seeking'
    | 'video:stalled'
    | 'video:suspend'
    | 'video:timeupdate'
    | 'video:volumechange'
    | 'video:waiting'
    | 'hotkey'
    | 'destroy'
    | 'customType'
    | 'url'
    | 'subtitleUpdate'
    | 'subtitleLoad'
    | 'subtitleSwitch'
    | 'focus'
    | 'blur'
    | 'dblclick'
    | 'click'
    | 'setBar'
    | 'hover'
    | 'mousemove'
    | 'resize'
    | 'view'
    | 'aspectRatio'
    | 'autoHeight'
    | 'autoSize'
    | 'ready'
    | 'error'
    | 'flip'
    | 'fullscreen'
    | 'fullscreenWeb'
    | 'loop'
    | 'mini'
    | 'pause'
    | 'pip'
    | 'playbackRate'
    | 'play'
    | 'screenshot'
    | 'seek'
    | 'subtitleOffset'
    | 'switch'
    | 'restart'
    | 'volume'
    | 'lock'
    | 'selector'
    | (string & Record<never, never>);

declare class Player {
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
    attr(key: string, value: any): void;
    switchUrl(url: string): Promise<string>;
    switchQuality(url: string): Promise<string>;
    getDataURL(): Promise<string>;
    getBlobUrl(): Promise<string>;
    screenshot(): Promise<string>;
    airplay(): void;
}

declare class Artplayer extends Player {
    constructor(option: Option, readyCallback?: (this: Artplayer) => void);

    static instances: Artplayer[];
    static version: string;
    static env: string;
    static build: string;
    static config: {
        propertys: {
            [key: string]: string[];
        };
        methods: {
            [key: string]: string[];
        };
        events: {
            [key: string]: string[];
        };
        prototypes: {
            [key: string]: string[];
        };
    };
    static utils: {
        [key: string]: string | Function;
    };
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

    on(name: Events, fn: Function, ctx?: object): void;
    once(name: Events, fn: Function, ctx?: object): void;
    emit(name: Events): void;
    off(name: Events, callback?: Function): void;

    query: Artplayer['template']['query'];
    proxy: Artplayer['events']['proxy'];

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
        readonly $info: HTMLElement;
        readonly $infoPanel: HTMLElement;
        readonly $infoClose: HTMLElement;
        readonly $miniHeader: HTMLElement;
        readonly $miniTitle: HTMLElement;
        readonly $miniClose: HTMLElement;
        readonly $contextmenu: HTMLElement;
    };

    readonly events: {
        proxy<KW extends keyof WindowEventMap, KH extends keyof HTMLElementEventMap>(
            element: HTMLDivElement | Document | Window,
            eventName: KW | KH,
            handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event) => void,
            options?: boolean | AddEventListenerOptions,
        ): () => void;
        hover(element: HTMLElement, mouseenter?: EventCallback, mouseleave?: EventCallback): void;
        loadImg(element: HTMLImageElement | string): Promise<HTMLImageElement>;
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
        clear(): any;
    };

    readonly icons: {
        readonly loading: HTMLElement;
        readonly state: HTMLElement;
        readonly play: HTMLElement;
        readonly pause: HTMLElement;
        readonly check: HTMLElement;
        readonly volume: HTMLElement;
        readonly volumeClose: HTMLElement;
        readonly subtitle: HTMLElement;
        readonly screenshot: HTMLElement;
        readonly setting: HTMLElement;
        readonly fullscreen: HTMLElement;
        readonly fullscreenWeb: HTMLElement;
        readonly pip: HTMLElement;
        readonly indicator: HTMLElement;
        readonly arrowLeft: HTMLElement;
        readonly arrowRight: HTMLElement;
        readonly playbackRate: HTMLElement;
        readonly aspectRatio: HTMLElement;
        readonly config: HTMLElement;
    };

    readonly hotkey: {
        add(key: number, callback: EventCallback): Artplayer['hotkey'];
    };

    readonly plugins: {
        readonly id: number;
        add(plugin: PluginFunction): Artplayer['plugins'];
        [pluginName: string]: any;
    };

    readonly i18n: {
        readonly languages: {
            [key: string]: object;
        };
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
        set url(url: string);
        style(name: string | CSSStyleDeclaration, value?: string): HTMLElement;
        switch(url: string, option?: SubtitleOption): Promise<string>;
    };

    readonly mobile: object;

    readonly player: Player;

    readonly info: Component;

    readonly loading: Component;

    readonly mask: Component;

    readonly layers: Record<string, HTMLElement> & Component;

    readonly controls: Record<string, HTMLElement> & Component;

    readonly contextmenu: Record<string, HTMLElement> & Component;

    readonly setting: Record<string, HTMLElement> & Component;
}
