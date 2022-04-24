import { secondToTime } from '../utils';

export default function autoPlayback(art) {
    const { storage, i18n } = art;

    art.on('video:timeupdate', () => {
        const times = storage.get('times') || {};
        const keys = Object.keys(times);
        if (keys.length > 10) delete times[keys[0]];
        times[art.option.url] = art.currentTime;
        storage.set('times', times);
    });

    art.on('ready', () => {
        const times = storage.get('times') || {};
        const currentTime = times[art.option.url];
        if (currentTime) {
            art.seek = currentTime;
            art.notice.show = `${i18n.get('Auto playback at')} ${secondToTime(currentTime)}`;
        }
    });

    return {
        name: 'autoPlayback',
    };
}
