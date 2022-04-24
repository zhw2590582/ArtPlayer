export default function autoPlayback(art) {
    const { storage } = art;

    art.on('video:timeupdate', () => {
        const times = storage.get('times') || {};
        times[art.option.url] = art.currentTime;
        storage.set('times', times);
    });

    art.on('ready', () => {
        const times = storage.get('times') || {};
        const currentTime = times[art.option.url];
        if (currentTime) {
            art.seek = currentTime;
            art.notice.show = '';
        }
    });

    return {
        name: 'autoPlayback',
    };
}
