import { def } from '../utils';

export default function rectMix(art) {
    def(art, 'rect', {
        get: () => {
            return art.template.$player.getBoundingClientRect();
        },
    });

    ['bottom', 'height', 'left', 'right', 'top', 'width'].forEach((key) => {
        def(art, key, {
            get: () => {
                return art.rect[key];
            },
        });
    });

    def(art, 'x', {
        get: () => {
            return art.left + window.pageXOffset;
        },
    });

    def(art, 'y', {
        get: () => {
            return art.top + window.pageYOffset;
        },
    });
}
