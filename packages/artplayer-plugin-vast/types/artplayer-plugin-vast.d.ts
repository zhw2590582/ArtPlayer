import type Artplayer from 'artplayer'

export = artplayerPluginVast
export as namespace artplayerPluginVast

declare function artplayerPluginVast(option: artplayerPluginVast.Option): (art: Artplayer) => artplayerPluginVast.VastPlugin

declare namespace artplayerPluginVast {
  interface Option {
    /**
     * The URL of the IMA SDK to load.
     * Default: '//imasdk.googleapis.com/js/sdkloader/ima3.js'
     */
    sdkUrl?: string

    /**
     * The VAST tag URL to request ads from.
     */
    url?: string

    /**
     * The VAST XML response to use for ads.
     */
    adsResponse?: string

    /**
     * The z-index of the ad container.
     * Default: 150
     */
    zIndex?: number

    /**
     * Whether to show the big play button when the ad is paused.
     * Default: true
     */
    showBigPlayOnPause?: boolean

    /**
     * Whether to disable VPAID ads.
     * Default: true
     */
    disableVpaid?: boolean

    /**
     * Whether to disable custom playback for iOS 10+.
     * Default: true
     */
    disableCustomPlaybackForIOS10Plus?: boolean

    /**
     * Whether to restore custom playback state on ad break complete.
     * Default: true
     */
    restoreCustomPlaybackStateOnAdBreakComplete?: boolean

    /**
     * Whether to automatically initialize the ad manager on user interaction.
     * Default: true
     */
    autoInit?: boolean

    /**
     * Whether to enable debug logging.
     * Default: false
     */
    debug?: boolean

    [key: string]: any
  }

  interface VastPlugin {
    name: 'artplayerPluginVast'

    /**
     * Initialize the plugin manually.
     * This should be called as a result of a user action (e.g. click).
     */
    init: () => Promise<any>

    /**
     * Request ads using an AdsRequest object.
     * @param adsRequest The google.ima.AdsRequest object or compatible object.
     */
    requestAds: (adsRequest: any) => void

    /**
     * Play ads from a VAST tag URL.
     * @param url The VAST tag URL.
     */
    playAdTag: (url: string) => void

    /**
     * Play ads from a VAST XML response.
     * @param response The VAST XML response.
     */
    playAdsResponse: (response: string) => void

    /**
     * Destroy the plugin and clean up resources.
     */
    destroy: () => void

    /**
     * The google.ima.AdsLoader instance.
     */
    readonly adsLoader: any

    /**
     * The google.ima.AdsManager instance.
     */
    readonly adsManager: any
  }
}
