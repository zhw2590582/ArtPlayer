export default class Artplayer {
    constructor(option: {
        /**
         * Selector or a dom element (required)
         */
        container: string | Element;

        /**
         * Video url or a function that returns a promise value of url (required)
         */
        url: string | Function;

        /**
         * Video cover url
         */
        poster?: string;

        /**
         * Video title
         */
        title?: string;

        /**
         * Theme color like: #fff
         */
        theme?: string;

        /**
         * Display language
         */
        lang?: 'en' | 'zh-cn' | 'zh-tw';

        /**
         * Initialize volume 0 ~ 1, will be overwritten by cached values
         */
        volume?: number;

        /**
         * Whether to mute by default
         */
        muted?: boolean;

        /**
         * Whether to autoplay by default
         */
        autoplay?: boolean;

        /**
         * Whether to automatically adapt to the size of the container
         */
        autoSize?: boolean;

        /**
         * Whether to loop
         */
        loop?: boolean;

        /**
         * Whether to display playbackRate button
         */
        playbackRate?: boolean;

        /**
         * Whether to display aspectRatio option
         */
        aspectRatio?: boolean;

        /**
         * Whether to display screenshot button
         */
        screenshot?: boolean;

        /**
         * Whether to display setting button
         */
        setting?: boolean;

        /**
         * Whether to use hotkey
         */
        hotkey?: boolean;

        /**
         * Whether to display pip button
         */
        pip?: boolean;

        /**
         * Whether to play mutually exclusive when multiple players
         */
        mutex?: boolean;

        /**
         * Whether to display fullscreen button
         */
        fullscreen?: boolean;

        /**
         * Whether to display web fullscreen button
         */
        fullscreenWeb?: boolean;

        /**
         * Initialize the custom layer
         */
        layers?: object[];

        /**
         * Initialize the custom contextmenu
         */
        contextmenu?: object[];

        /**
         * Initialize the custom quality
         */
        quality?: object[];

        /**
         * Initialize the custom controls
         */
        controls?: object[];

        /**
         * Initialize the custom highlight
         */
        highlight?: object[];

        /**
         * Initialize the custom plugins
         */
        plugins?: Function[];

        /**
         * Initialize the custom whitelist
         */
        whitelist?: [string, Function, regexp];

        /**
         * Thumbnails option
         */
        thumbnails?: {
            url: string;
            number?: number;
            width?: number;
            height?: number;
            column?: number;
        };

        /**
         * Subtitle option
         */
        subtitle?: {
            url: string;
            style: object;
        };

        /**
         * More video attributes
         */
        moreVideoAttr?: object;

        /**
         * Custom icon
         */
        icons?: {
            loading?: string;
            playBig?: string;
        };

        /**
         * Custom video type
         */
        customType?: {
            [propName: string]: Function;
        };
    });
}
