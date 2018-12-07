function i18nMix(i18n) {
    i18n.update({
        'zh-cn': {
            'Only file types are supported': '只支持文件类型',
            'Load local video successfully': '加载本地视频成功',
        },
        'zh-tw': {
            'Only file types are supported': '只支持文件類型',
            'Load local video successfully': '加載本地視頻成功',
        },
    });
}

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
    i18nMix(i18n);

    function loadVideo(file) {
        const fileTypes = ['video/mp4', 'audio/ogg', 'video/webm'];
        if (file) {
            if (fileTypes.includes(file.type)) {
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
                const tip = `${file.type}, ${i18n.get('Only file types are supported')}: ${fileTypes.toString()}`;
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
