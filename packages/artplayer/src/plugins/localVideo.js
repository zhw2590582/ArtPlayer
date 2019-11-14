import { append, setStyle, setStyles, errorHandle, getExt } from '../utils';

export default function localVideo(art) {
    const {
        events: { proxy },
        notice,
        i18n,
        template,
        player,
    } = art;

    const notSupport = 'Playback of this file format is not supported';
    i18n.update({
        'zh-cn': {
            [notSupport]: '不支持播放该文件格式',
        },
        'zh-tw': {
            [notSupport]: '不支持播放該文件格式',
        },
    });

    function loadVideo(file) {
        if (file) {
            const type = getExt(file.name);
            const canPlayType = template.$video.canPlayType(file.type);
            if (canPlayType === 'maybe' || canPlayType === 'probably') {
                const url = URL.createObjectURL(file);
                player.switchUrl(url, file.name);
            } else {
                const tip = `${i18n.get(notSupport)}: ${file.type || type}`;
                notice.show(tip, true, 3000);
                errorHandle(false, tip);
            }
        }
    }

    proxy(template.$player, 'dragover', e => {
        e.preventDefault();
    });

    proxy(template.$player, 'drop', e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        loadVideo(file);
    });

    return {
        name: 'localVideo',
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
