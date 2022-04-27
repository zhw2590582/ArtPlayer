import { secondToTime, setStyle } from '../utils';

export default function autoPlayback(art) {
    const {
        i18n,
        storage,
        constructor,
        template: { $poster },
    } = art;

    art.on('video:timeupdate', () => {
        const times = storage.get('times') || {};
        const keys = Object.keys(times);
        if (keys.length > constructor.AUTO_PLAYBACK_MAX) delete times[keys[0]];
        times[art.option.url] = art.currentTime;
        storage.set('times', times);
    });

    art.on('ready', () => {
        const times = storage.get('times') || {};
        const currentTime = times[art.option.url];
        if (currentTime) {
            art.seek = currentTime;
            setStyle($poster, 'display', 'none');
            art.notice.show = `${i18n.get('Auto playback at')} ${secondToTime(currentTime)}`;
        }
    });

    return {
        name: 'autoPlayback',
        get times() {
            return storage.get('times') || {};
        },
        clear() {
            return storage.del('times');
        },
    };
}
