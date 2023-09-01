import { secondToTime, setStyle, query, append } from '../utils';

export default function autoPlayback(art) {
    const {
        i18n,
        icons,
        storage,
        constructor,
        proxy,
        template: { $poster },
    } = art;

    const $autoPlayback = art.layers.add({
        name: 'auto-playback',
        html: `
            <div class="art-auto-playback-close"></div>
            <div class="art-auto-playback-last"></div>
            <div class="art-auto-playback-jump"></div>
        `,
    });

    const $last = query('.art-auto-playback-last', $autoPlayback);
    const $jump = query('.art-auto-playback-jump', $autoPlayback);
    const $close = query('.art-auto-playback-close', $autoPlayback);

    art.on('video:timeupdate', () => {
        if (art.playing) {
            const times = storage.get('times') || {};
            const keys = Object.keys(times);
            if (keys.length > constructor.AUTO_PLAYBACK_MAX) {
                delete times[keys[0]];
            }
            times[art.option.id || art.option.url] = art.currentTime;
            storage.set('times', times);
        }
    });

    art.on('ready', () => {
        const times = storage.get('times') || {};
        const currentTime = times[art.option.id || art.option.url];
        if (currentTime && currentTime >= constructor.AUTO_PLAYBACK_MIN) {
            append($close, icons.close);
            setStyle($autoPlayback, 'display', 'flex');

            $last.innerText = `${i18n.get('Last Seen')} ${secondToTime(currentTime)}`;
            $jump.innerText = i18n.get('Jump Play');

            proxy($close, 'click', () => {
                setStyle($autoPlayback, 'display', 'none');
            });

            proxy($jump, 'click', () => {
                art.seek = currentTime;
                art.play();
                setStyle($poster, 'display', 'none');
                setStyle($autoPlayback, 'display', 'none');
            });

            art.once('video:timeupdate', () => {
                setTimeout(() => {
                    setStyle($autoPlayback, 'display', 'none');
                }, constructor.AUTO_PLAYBACK_TIMEOUT);
            });
        }
    });

    return {
        name: 'auto-playback',
        get times() {
            return storage.get('times') || {};
        },
        clear() {
            return storage.del('times');
        },
        delete(id) {
            const times = storage.get('times') || {};
            delete times[id];
            storage.set('times', times);
            return times;
        },
    };
}
