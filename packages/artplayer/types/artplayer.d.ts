export default class Artplayer {
    constructor(option: {
        container: string | Element;
        url: string;
        poster?: string;
        title?: string;
        type?: string;
        mimeCodec?: string;
        theme?: string;
        lang?: string;
        volume?: number;
        isLive?: boolean;
        muted?: boolean;
        autoplay?: boolean;
        autoSize?: boolean;
        loop?: boolean;
        playbackRate?: boolean;
        aspectRatio?: boolean;
        screenshot?: boolean;
        setting?: boolean;
        hotkey?: boolean;
        pip?: boolean;
        mutex?: boolean;
        fullscreen?: boolean;
        fullscreenWeb?: boolean;
        layers?: any[];
        contextmenu?: any[];
        quality?: any[];
        controls?: any[];
        highlight?: any[];
        plugins?: any[];
        whitelist?: any[];
        thumbnails?: object;
        subtitle?: object;
        moreVideoAttr?: object;
        icons?: object;
        customType?: object;
    });
}
