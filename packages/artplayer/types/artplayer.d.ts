export default class Artplayer {
    constructor(option: {
        /**
         * Selector or a dom element (required)
         */
        container: string;

        /**
         * Video url or a function that returns a promise value of url (required)
         */
        url: string;

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
         * Whether to live by default
         */
        isLive?: boolean;

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
         * When the player scrolls out of the viewport, the mini player mode is automatically enabled
         */
        autoMin?: boolean;

        /**
         * Whether to loop
         */
        loop?: boolean;

        /**
         * Whether to display flip button
         */
        flip?: boolean;

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
         * Whether to display the light mode in the context menu
         */
        light?: boolean;

        /**
         * Whether to use blurred background in the context menu and settings panel
         */
        backdrop?: boolean;

        /**
         * Whether to display fullscreen button
         */
        fullscreen?: boolean;

        /**
         * Whether to display web fullscreen button
         */
        fullscreenWeb?: boolean;

        /**
         * Subtitle time offset plugin
         */
        subtitleOffset?: boolean;

        /**
         * Mini progress bar plugin
         */
        miniProgressBar?: boolean;

        /**
         * Local video preview plugin. By default, a configuration is added in the settings panel.
         */
        localVideo?: boolean;

        /**
         * Local subtitle preview plugin. By default, a configuration is added in the settings panel.
         */
        localSubtitle?: boolean;

        /**
         * A network monitor is used to monitor the blocking of the video.
         */
        networkMonitor?: boolean;

        /**
         * Initialize the custom plugins
         */
        plugins?: Function[];

        /**
         * Initialize the custom whitelist
         */
        whitelist?: [string, Function, RegExp];

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
            [propName: string]: string;
        };

        /**
         * Custom video type
         */
        customType?: {
            [propName: string]: Function;
        };
    });
}
