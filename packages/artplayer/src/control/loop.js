import { append, setStyle } from '../utils';

export default function loop(option) {
    return (art) => ({
        ...option,
        mounted: ($control) => {
            const $left = append($control, `<span class="art-loop-point"></span>`);
            const $right = append($control, `<span class="art-loop-point"></span>`);

            art.on('loop', (value) => {
                if (value && value.length) {
                    setStyle($control, 'display', 'flex');
                    setStyle($left, 'left', `calc(${(value[0] / art.duration) * 100}% - ${$left.clientWidth}px)`);
                    setStyle($right, 'left', `${(value[1] / art.duration) * 100}%`);
                } else {
                    setStyle($control, 'display', 'none');
                }
            });
        },
    });
}
