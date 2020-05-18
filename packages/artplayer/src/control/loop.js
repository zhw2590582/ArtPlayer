import { append, setStyle } from '../utils';

export default function loop(option) {
    return (art) => ({
        ...option,
        mounted: ($control) => {
            const { player } = art;

            const $left = append($control, '<span class="art-loop-left"></span>');
            const $right = append($control, '<span class="art-loop-right"></span>');

            art.on('loopAdd', (value) => {
                setStyle($control, 'display', 'block');
                setStyle($left, 'left', `calc(${(value[0] / player.duration) * 100}% - 6px)`);
                setStyle($right, 'left', `${(value[1] / player.duration) * 100}%`);
            });

            art.on('loopRemove', () => {
                setStyle($control, 'display', 'node');
            });
        },
    });
}
