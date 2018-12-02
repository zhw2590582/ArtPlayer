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

export default function artplayerPluginLocalPreview(art) {
    const {
        getExt,
        append,
        setStyle,
        setStyles,
        sleep,
    } = art.constructor.utils;
    const formats = ['mp4', 'ogg', 'webm'];
    const {
        events: {
            proxy,
        },
        option,
        notice,
        i18n,
        template,
        player,
    } = art;
    i18nMix(i18n);

    return {
        attach(target) {
            console.log(target);
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
                if (!file) {
                    return;
                }
                const ext = getExt(file.name);
                if (ext && formats.includes(ext)) {
                    const url = URL.createObjectURL(file);
                    player.playbackRateRemove();
                    player.aspectRatioRemove();
                    template.$video.src = url;
                    sleep(100).then(() => {
                        player.seek(0);
                    });
                    option.url = url;
                    art.emit('switch', url);
                    notice.show(i18n.get('Load local video successfully'));
                } else {
                    const tip = `${i18n.get('Only file types are supported')}: ${formats.toString()}`;
                    notice.show(tip, true, 3000);
                    console.warn(tip);
                }
            });
        },
    };
}
