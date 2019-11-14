import { append, setStyle, setStyles, errorHandle } from '../utils';

export default function localVideo(art) {
    const {
        events: { proxy },
        template,
        player,
    } = art;

    function loadVideo(file) {
        if (file) {
            const canPlayType = template.$video.canPlayType(file.type);
            if (canPlayType === 'maybe' || canPlayType === 'probably') {
                const url = URL.createObjectURL(file);
                player.switchUrl(url, file.name);
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
