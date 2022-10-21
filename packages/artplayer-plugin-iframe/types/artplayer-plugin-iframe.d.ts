export = ArtplayerPluginIframe;
export as namespace ArtplayerPluginIframe;

type Message = {
    type: string;
    data: any;
    id?: number;
};

declare class ArtplayerPluginIframe {
    constructor(option: { iframe: HTMLIFrameElement; url: string });

    static iframe: boolean;
    static postMessage(message: Message): void;
    static onMessage(event: MessageEvent & { data: Message }): void;
    static inject(): void;

    readonly promises: Record<number, { resove: Function; reject: Function }>;
    readonly injected: boolean;
    readonly destroyed: boolean;
    readonly $iframe: HTMLIFrameElement;
    readonly url: string;
    readonly messageCallback: (...args: any[]) => any;

    onMessage(event: MessageEvent & { data: Message }): void;
    postMessage(message: Message): Promise<any>;
    commit<T extends (...args: any[]) => any>(callback: T): Promise<ReturnType<T>>;
    message(callback: (...args: any[]) => any): void;
    destroy(): void;
}
