import type Artplayer from 'artplayer';

export = artplayerPluginVast;
export as namespace artplayerPluginVast;

declare function artplayerPluginVast(options?: artplayerPluginVast.Options): (art: Artplayer) => artplayerPluginVast.Result;

declare namespace artplayerPluginVast {
    interface Options {
        [key: string]: any;
    }

    interface Result {
        name: 'artplayerPluginVast';
        
        /**
         * Request and play an ad from a VAST tag URL.
         * @param url The VAST ad tag URL.
         * @param config Optional AdsRequest configuration properties.
         */
        playAdTag(url: string, config?: Record<string, any>): void;

        /**
         * Request and play an ad from a raw VAST XML string.
         * @param xml The VAST XML content.
         * @param config Optional AdsRequest configuration properties.
         */
        playAdsResponse(xml: string, config?: Record<string, any>): void;

        /**
         * Manually initialize the IMA SDK.
         */
        init(): Promise<any>;

        /**
         * Destroy the current ad session and clean up.
         */
        destroy(): void;

        /**
         * The Google IMA AdsLoader instance.
         */
        readonly adsLoader: any;

        /**
         * The Google IMA AdsManager instance.
         */
        readonly adsManager: any;
    }

    interface Events {
        'vast:adsManagerLoaded': any;
        'vast:adLoaded': any;
        'vast:adStarted': any;
        'vast:adPaused': any;
        'vast:adResumed': any;
        'vast:adSkipped': any;
        'vast:adComplete': any;
        'vast:allAdsCompleted': void;
        'vast:adError': any;
        'vast:adClick': any;
    }
}

declare global {
    interface Window {
        artplayerPluginVast: typeof artplayerPluginVast;
        google: {
            ima: any;
        };
    }
}
