import { append, query, setStyle, setStyles, errorHandle } from '../utils';

export default function localVideo(art) {
    const {
        events: { proxy },
        template,
        player,
        option,
        setting,
        i18n,
    } = art;

    function loadVideo(file) {
        if (file) {
            const canPlayType = template.$video.canPlayType(file.type);
            if (canPlayType === 'maybe' || canPlayType === 'probably') {
                const url = URL.createObjectURL(file);
                option.title = file.name;
                player.switchUrl(url, file.name);
                art.emit('localVideo', file);
            } else {
                errorHandle(false, 'Playback of this file format is not supported');
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

    function attach(target) {
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
    }

    art.once('ready', () => {
        setting.add({
            title: 'Local Video',
            name: 'localVideo',
            index: 30,
            html: `
                <div class="art-setting-header">
                    ${i18n.get('Local Video')}
                </div>
                <div class="art-setting-upload">
                    <div class="art-upload-btn">${i18n.get('Open')}</div>
                    <div class="art-upload-value"></div>
                </div>
            `,
            mounted: $setting => {
                const $btn = query('.art-upload-btn', $setting);
                const $value = query('.art-upload-value', $setting);
                art.on('localVideo', file => {
                    $value.textContent = file.name;
                    $value.title = file.name;
                });
                attach($btn);
            },
        });
    });

    return {
        name: 'localVideo',
        attach,
    };
}
