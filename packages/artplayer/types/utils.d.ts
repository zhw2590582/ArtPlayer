export type Utils = {
    userAgent: string;
    isMobile: boolean;
    isSafari: boolean;
    isWechat: boolean;
    isIE: boolean;
    isAndroid: boolean;
    isIOS: boolean;
    isIOS13: boolean;
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
    getIcon(key: string, html: string | HTMLElement): HTMLElement;
};
