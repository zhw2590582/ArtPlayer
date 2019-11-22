import { query, append, setStyle, setStyles, errorHandle, getExt, vttToBlob, srtToVtt, assToVtt } from '../utils';

export default function localSubtitle(art) {
    const {
        events: { proxy },
        subtitle,
        setting,
        i18n,
    } = art;

    function loadSubtitle(file) {
        if (file) {
            const type = getExt(file.name);
            if (['ass', 'vtt', 'srt'].includes(type)) {
                const reader = new FileReader();
                proxy(reader, 'load', event => {
                    const text = event.target.result;
                    switch (type) {
                        case 'srt': {
                            const url = vttToBlob(srtToVtt(text));
                            subtitle.switch(url, file.name);
                            break;
                        }
                        case 'ass': {
                            const url = vttToBlob(assToVtt(text));
                            subtitle.switch(url, file.name);
                            break;
                        }
                        case 'vtt': {
                            const url = vttToBlob(text);
                            subtitle.switch(url, file.name);
                            break;
                        }
                        default:
                            break;
                    }
                    art.emit('localSubtitle', file);
                });
                reader.readAsText(file);
            } else {
                errorHandle(false, 'Only supports subtitle files in .ass, .vtt and .srt format');
            }
        }
    }

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
            loadSubtitle(file);
        });
    }

    art.on('ready', () => {
        setting.add({
            title: 'Local Subtitle',
            name: 'localSubtitle',
            index: 40,
            html: `
<div class="art-setting-header">
    ${i18n.get('Local Subtitle')}
</div>
<div class="art-setting-upload">
    <div class="art-upload-btn">${i18n.get('Open')}</div>
    <div class="art-upload-value"></div>
</div>
            `,
            mounted: $setting => {
                const $btn = query('.art-upload-btn', $setting);
                const $value = query('.art-upload-value', $setting);
                art.on('localSubtitle', file => {
                    $value.textContent = file.name;
                    $value.title = file.name;
                });
                attach($btn);
            },
        });
    });

    return {
        name: 'localSubtitle',
        attach,
    };
}
