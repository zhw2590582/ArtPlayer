import config from './config';
import { clamp, getExt } from './utils';

export default class Mobile {
    constructor(art) {
        const {
            option,
            proxy,
            template: { $video },
        } = art;

        for (let index = 0; index < config.events.length; index++) {
            proxy($video, config.events[index], (event) => {
                art.emit(`video:${event.type}`, event);
            });
        }

        Object.keys(option.moreVideoAttr).forEach((key) => {
            $video[key] = option.moreVideoAttr[key];
        });

        $video.controls = true;

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

        if (option.playsInline) {
            $video.playsInline = true;
            $video['webkit-playsinline'] = true;
        }

        const typeName = option.type || getExt(option.url);
        const typeCallback = option.customType[typeName];
        if (typeName && typeCallback) {
            typeCallback($video, option.url, art);
            art.emit('customType', typeName);
        } else {
            $video.src = option.url;
            art.emit('url', $video.src);
        }
    }
}
