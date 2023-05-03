import { Config } from './config';
import { Events } from './events';
import { Utils } from './utils';
import { Player } from './player';
import { Option } from './option';
import { Subtitle } from './subtitle';
import { Icons } from './icons';
import { Template } from './template';
import { I18n } from './i18n';
import { Setting, SettingOption } from './setting';
import { Component } from './component';

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
    static RESIZE_TIME: number;
    static SCROLL_TIME: number;
    static SCROLL_GAP: number;
    static AUTO_PLAYBACK_MAX: number;
    static AUTO_PLAYBACK_MIN: number;
    static AUTO_PLAYBACK_TIMEOUT: number;
    static RECONNECT_TIME_MAX: number;
    static RECONNECT_SLEEP_TIME: number;
    static CONTROL_HIDE_TIME: number;
    static DBCLICK_TIME: number;
    static DBCLICK_FULLSCREEN: boolean;
    static MOBILE_DBCLICK_PLAY: boolean;
    static MOBILE_CLICK_PLAY: boolean;
    static AUTO_ORIENTATION_TIME: number;
    static INFO_LOOP_TIME: number;
    static FAST_FORWARD_VALUE: number;
    static FAST_FORWARD_TIME: number;
    static TOUCH_MOVE_RATIO: number;
    static VOLUME_STEP: number;
    static SEEK_STEP: number;
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
        remove(event: Event): void;
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
        timer: number;
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
        remove(key: number, callback: Function): Artplayer['hotkey'];
    };

    readonly mask: Component;

    readonly setting: {
        option: SettingOption[];
        updateStyle(width?: number): void;
        find(name: string): SettingOption;
        add(setting: Setting): SettingOption[];
        update(settings: Setting): SettingOption[];
        remove(name: string): SettingOption[];
    } & Component;

    readonly plugins: {
        add(plugin: (this: Artplayer, art: Artplayer) => unknown): Artplayer['plugins'];
        [pluginName: string]: any;
    };
}
