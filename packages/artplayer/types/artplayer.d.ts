type Component = {
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
        name: string;
    }[];
    onSelect?: Function;
};

export default class Artplayer {
    constructor(option: {
        container: string | HTMLElement;
        url: string;
        poster?: string;
        title?: string;
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
        light?: boolean;
        backdrop?: boolean;
        fullscreen?: boolean;
        fullscreenWeb?: boolean;
        subtitleOffset?: boolean;
        miniProgressBar?: boolean;
        localVideo?: boolean;
        localSubtitle?: boolean;
        networkMonitor?: boolean;
        plugins?: Function[];
        whitelist?: (string | Function | RegExp)[];
        layers?: Component[];
        contextmenu?: Component[];
        controls?: Component[];
        quality?: {
            default?: boolean;
            name: string;
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
            encoding: string,
            bilingual: boolean,
        };
        moreVideoAttr?: object;
        icons?: {
            [propName: string]: string | HTMLElement;
        };
        customType?: {
            [propName: string]: Function;
        };
    });
}
