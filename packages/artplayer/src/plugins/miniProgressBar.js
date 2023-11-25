import { addClass, removeClass } from '../utils';

export default function miniProgressBar(art) {
    art.on('control', (state) => {
        if (state) {
            removeClass(art.template.$player, 'art-mini-progress-bar');
        } else {
            addClass(art.template.$player, 'art-mini-progress-bar');
        }
    });

    return { name: 'mini-progress-bar' };
}
