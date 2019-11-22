import { def } from '../utils';

export default function rectMix(art, player) {
    def(player, 'rect', {
        get: () => {
            return art.template.$player.getBoundingClientRect();
        },
    });

    ['bottom', 'height', 'left', 'right', 'top', 'width'].forEach(key => {
        def(player, key, {
            get: () => {
                return player.rect[key];
            },
        });
    });

    def(player, 'x', {
        get: () => {
            return player.left + window.pageXOffset;
        },
    });

    def(player, 'y', {
        get: () => {
            return player.top + window.pageYOffset;
        },
    });
}
