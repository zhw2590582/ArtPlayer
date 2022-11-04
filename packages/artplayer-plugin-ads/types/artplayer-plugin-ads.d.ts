import type Artplayer from 'artplayer';

export = artplayerPluginAds;
export as namespace artplayerPluginAds;

type Option = {
    /**
     * html广告，假如是视频广告则忽略该值
     */
    html?: string;

    /**
     * 视频广告的地址
     */
    video?: string;

    /**
     * 广告跳转网址，为空则不跳转
     */
    url?: string;

    /**
     * 必须观看的时长，期间不能被跳过，单位为秒
     */
    playDuration?: number;

    /**
     * 广告总时长，单位为秒
     */
    totalDuration?: string;

    /**
     * 视频广告是否默认静音
     */
    muted?: boolean;
};

type Ads = {
    name: 'artplayerPluginAds';

    /**
     * 跳过广告
     */
    skip: () => void;

    /**
     * 暂停广告
     */
    pause: () => void;

    /**
     * 播放广告
     */
    play: () => void;
};

declare const artplayerPluginAds: (option: Option) => (art: Artplayer) => Ads;
