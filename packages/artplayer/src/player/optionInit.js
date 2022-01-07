import { clamp, setStyle } from '../utils';

export default function attrInit(art) {
    const {
        option,
        storage,
        template: { $video, $poster },
    } = art;

    Object.keys(option.moreVideoAttr).forEach((key) => {
        art.attr(key, option.moreVideoAttr[key]);
    });

    if (option.muted) {
        art.muted = option.muted;
    }

    if (option.volume) {
        art.volume = clamp(option.volume, 0, 1);
    }

    const volume = storage.get('volume');
    if (volume) {
        art.volume = clamp(volume, 0, 1);
    }

    if (option.poster) {
        setStyle($poster, 'backgroundImage', `url(${option.poster})`);
    }

    if (option.autoplay) {
        $video.autoplay = option.autoplay;
    }

    if (option.theme) {
        art.theme = option.theme;
    }

    if (option.ads.length === 0) {
        art.url = option.url;
    }
}
