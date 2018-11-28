import { clamp } from '../utils';

export default function attrInit(art, player) {
    const {
        option,
        template: { $video },
    } = art;
    Object.keys(option.moreVideoAttr).forEach(key => {
        $video[key] = option.moreVideoAttr[key];
    });

    if (option.muted) {
        $video.muted = option.muted;
    }
    
    if (option.volume) {
        $video.volume = clamp(option.volume, 0, 1);
    }

    if (option.poster) {
        $video.poster = option.poster;
    }

    if (option.autoplay) {
        $video.autoplay = option.autoplay;
    }

    player.attachUrl(option.url);
}
