import { def } from '../utils';

export default function rectMix(art) {
    def(art, 'rect', {
        get: () => {
            return art.template.$player.getBoundingClientRect();
        },
    });

    const keys = ['bottom', 'height', 'left', 'right', 'top', 'width'];
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        def(art, key, {
            get: () => {
                return art.rect[key];
            },
        });
    }

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
