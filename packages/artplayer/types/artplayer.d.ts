import Config from './config';
import Events from './events';
import Utils from './utils';
import Player from './player';
import Option from './option';
import Subtitle from './subtitle';
import Plugin from './plugin';
import { I18nKeys, I18nValue } from './i18n';

export = Artplayer;
export as namespace Artplayer;

declare class Artplayer extends Player {
    constructor(option: Option, readyCallback?: (this: Artplayer) => void);

    static readonly instances: Artplayer[];
    static readonly version: string;
    static readonly env: string;
    static readonly build: string;
    static readonly config: Config;
    static readonly utils: Utils;
    static readonly scheme: object;
    static readonly Emitter: Function;
    static readonly validator: Function;
    static readonly kindOf: Function;
    static readonly html: Artplayer['template']['html'];
    static readonly option: Option;

    static DEGUG: boolean;
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

    readonly id: number;
    readonly option: Option;
    readonly isLock: boolean;
    readonly isReady: boolean;
    readonly isFocus: boolean;
    readonly isInput: boolean;
    readonly isRotate: boolean;
    readonly isDestroy: boolean;

    on(name: Events, fn: Function, ctx?: object): void;
    once(name: Events, fn: Function, ctx?: object): void;
    emit(name: Events): void;
    off(name: Events, callback?: Function): void;

    query: Artplayer['template']['query'];
    proxy: Artplayer['events']['proxy'];

    destroy(removeHtml?: boolean): void;

    readonly whitelist: {
        get state(): boolean;
    };

    readonly template: {
        get html(): string;
        query(str: string): HTMLElement;
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
        name: 'artplayer_settings';
        settings: Record<string, any>;
        get(key: string): any;
        set(key: string, value: any): void;
        del(key: string): boolean;
        clear(): void;
    };

    readonly icons: {
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

    readonly i18n: {
        readonly languages: Record<I18nKeys, I18nValue>;
        get(key: string): string;
        update(language: Record<I18nKeys, I18nValue>): void;
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
        style(name: string | CSSStyleDeclaration, value?: string): HTMLElement;
        switch(url: string, option?: Subtitle): Promise<string>;
    } & Component;

    readonly info: Component;

    readonly loading: Component;

    readonly hotkey: {
        keys: Record<string, ((event: Event) => any)[]>;
        add(key: number, callback: (event: Event) => any): Artplayer['hotkey'];
    };

    readonly mask: Component;

    readonly setting: Record<string, HTMLElement> & Component;

    readonly plugins: {
        readonly id: number;
        add(plugin: Plugin): Artplayer['plugins'];
        [pluginName: string]: any;
    };

    readonly mobile: object;
}
