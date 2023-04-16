import { append, clamp, setStyle, isMobile } from '../utils';

export default function volume(option) {
    return (art) => ({
        ...option,
        mounted: ($control) => {
            const { proxy, icons } = art;
            const $volume = append($control, icons.volume);
            const $close = append($control, icons.volumeClose);
            const $panel = append($control, '<div class="art-volume-panel"></div>');
            const $inner = append($panel, '<div class="art-volume-inner"></div>');
            const $value = append($inner, `<div class="art-volume-val"></div>`);
            const $slider = append($inner, `<div class="art-volume-slider"></div>`);
            const $handle = append($slider, `<div class="art-volume-handle"></div>`);

            if (isMobile) {
                setStyle($panel, 'display', 'none');
            }

            function update() {
                if (art.muted || art.volume === 0) {
                    setStyle($volume, 'display', 'none');
                    setStyle($close, 'display', 'flex');
                    $value.innerText = 0;
                } else {
                    setStyle($volume, 'display', 'flex');
                    setStyle($close, 'display', 'none');
                    $value.innerText = Math.floor(art.volume * 100);
                }
            }

            update();
            art.on('video:volumechange', update);

            proxy($volume, 'click', () => {
                art.muted = true;
            });

            proxy($close, 'click', () => {
                art.muted = false;
            });
        },
    });
}
