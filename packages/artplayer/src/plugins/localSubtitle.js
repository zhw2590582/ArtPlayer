import { append, setStyle, setStyles, errorHandle, getExt, vttToBlob, srtToVtt, assToVtt } from '../utils';

export default function localSubtitle(art) {
    const {
        events: { proxy },
        subtitle,
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
                });
                reader.readAsText(file);
            } else {
                errorHandle(false, 'Only supports subtitle files in .ass, .vtt and .srt format');
            }
        }
    }

    return {
        name: 'localSubtitle',
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
                loadSubtitle(file);
            });
        },
    };
}
