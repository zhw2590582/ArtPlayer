export = ArtplayerHelperIframe;
export as namespace ArtplayerHelperIframe;

type Message = {
    type: string;
    data: any;
    id?: number;
};

class ArtplayerHelperIframe {
    constructor(option: { iframe: string; url: string });

    static postMessage(message: Message): void;
    static onMessage(event: MessageEvent & { data: Message }): void;
    static inject(): void;
    static destroy(): void;
    static isInject: boolean;
    static isDestroy: boolean;

    readonly promises: Record<number, { resove: Function; reject: Function }>;
    readonly isInject: boolean;
    readonly isDestroy: boolean;
    readonly $iframe: HTMLIFrameElement;
    readonly url: string;
    readonly messageCallback: Function;

    onMessage(event: MessageEvent & { data: Message }): void;
    postMessage(message: Message): Promise<any>;
    commit(callback: Function): Promise<any>;
    message(callback: Function): void;
    destroy(): void;
}
