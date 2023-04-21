type I18nKeys =
    | 'en'
    | 'zh-cn'
    | 'zh-tw'
    | 'pl'
    | 'cs'
    | 'es'
    | 'fa'
    | 'fr'
    | `id`
    | `ru`
    | (string & Record<never, never>);

type I18nValue = {
    'Video Info': string;
    Close: string;
    'Video Load Failed': string;
    Volume: string;
    Play: string;
    Pause: string;
    Rate: string;
    Mute: string;
    'Video Flip': string;
    Horizontal: string;
    Vertical: string;
    Reconnect: string;
    'Show Setting': string;
    'Hide Setting': string;
    Screenshot: string;
    'Play Speed': string;
    'Aspect Ratio': string;
    Default: string;
    Normal: string;
    Open: string;
    'Switch Video': string;
    'Switch Subtitle': string;
    Fullscreen: string;
    'Exit Fullscreen': string;
    'Web Fullscreen': string;
    'Exit Web Fullscreen': string;
    'Mini Player': string;
    'PIP Mode': string;
    'Exit PIP Mode': string;
    'PIP Not Supported': string;
    'Fullscreen Not Supported': string;
    'Subtitle Offset': string;
    'Last Seen': string;
    'Jump Play': string;
    AirPlay: string;
    'AirPlay Not Available': string;
};

export type I18n = Record<I18nKeys, Partial<I18nValue>>;
