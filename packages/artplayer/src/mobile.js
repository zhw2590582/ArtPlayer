import config from './config';
import { clamp, getExt } from './utils';

export default class Mobile {
    constructor(art) {
        const {
            option,
            events: { proxy },
            template: { $video },
        } = art;

        config.events.forEach(eventName => {
            proxy($video, eventName, event => {
                art.emit(`video:${event.type}`, event);
            });
        });

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

        $video.controls = true;

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
