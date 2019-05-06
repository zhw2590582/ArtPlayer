export default function localPreview(art) {
    const { append, setStyle, setStyles, sleep } = art.constructor.utils;
    const {
        events: { proxy },
        option,
        notice,
        i18n,
        template,
        player,
    } = art;

    i18n.update({
        'zh-cn': {
            'Playback of this file format is not supported': '不支持播放该文件格式',
            'Load local video successfully': '加载本地视频成功',
        },
        'zh-tw': {
            'Playback of this file format is not supported': '不支持播放該文件格式',
            'Load local video successfully': '加載本地視頻成功',
        },
    });

    function loadVideo(file) {
        if (file) {
            const canPlayType = template.$video.canPlayType(file.type);
            if (canPlayType === 'maybe' || canPlayType === 'probably') {
                const url = URL.createObjectURL(file);
                player.playbackRateRemove();
                player.aspectRatioRemove();
                template.$video.src = url;
                sleep(1000).then(() => {
                    player.currentTime = 0;
                });
                option.url = url;
                art.emit('switch', url);
                notice.show(i18n.get('Load local video successfully'));
            } else {
                const tip = `${i18n.get('Playback of this file format is not supported')}: ${file.type}`;
                notice.show(tip, true, 3000);
                console.warn(tip);
            }
        }
    }

    proxy(template.$player, 'dragover', e => {
        e.preventDefault();
        notice.show(i18n.get('Load local video successfully'));
    });

    proxy(template.$player, 'drop', e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        loadVideo(file);
    });

    return {
        name: 'localPreview',
        attach(target) {
            const $input = append(target, '<input type="file">');
            setStyle(target, 'position', 'relative');
            setStyles($input, {
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: '0',
                top: '0',
                opacity: '0',
            });
            proxy($input, 'change', () => {
                const file = $input.files[0];
                loadVideo(file);
            });
        },
    };
}
