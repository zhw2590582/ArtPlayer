import type Artplayer from 'artplayer';

export = artplayerPluginAds;
export as namespace artplayerPluginAds;

type Option = {
    /**
     * 广告源文本，支持视频链接、图片链接、HTML文本
     */
    source: string;

    /**
     * 知名广告的类型：'video' | 'image' | 'html'
     */
    type: 'video' | 'image' | 'html';

    /**
     * 广告必看的时长，单位为秒
     */
    playDuration?: number;

    /**
     * 广告总的时长，单位为秒
     */
    totalDuration?: number;

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
