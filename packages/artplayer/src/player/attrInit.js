import { clamp, setStyle } from '../utils';

export default function attrInit(art, player) {
    const {
        option,
        storage,
        template: { $video, $poster },
    } = art;

    Object.keys(option.moreVideoAttr).forEach((key) => {
        $video[key] = option.moreVideoAttr[key];
    });

    if (option.muted) {
        $video.muted = option.muted;
    }

    if (option.volume) {
        $video.volume = clamp(option.volume, 0, 1);
    }

    const volume = storage.get('volume');
    if (volume) {
        $video.volume = clamp(volume, 0, 1);
    }

    if (option.poster) {
        // $video.poster = option.poster;
        setStyle($poster, 'backgroundImage', `url(${option.poster})`);
    }

    if (option.autoplay) {
        $video.autoplay = option.autoplay;
    }

    $video.controls = false;
    player.url = option.url;
}
