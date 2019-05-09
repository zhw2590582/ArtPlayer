export default function rectMix(art, player) {
    Object.defineProperty(player, 'rect', {
        get: () => {
            return art.template.$player.getBoundingClientRect();
        },
    });

    ['bottom', 'height', 'left', 'right', 'top', 'width'].forEach(key => {
        Object.defineProperty(player, key, {
            get: () => {
                return player.rect[key];
            },
        });
    });

    Object.defineProperty(player, 'x', {
        get: () => {
            return player.left + window.pageXOffset;
        },
    });

    Object.defineProperty(player, 'y', {
        get: () => {
            return player.top + window.pageYOffset;
        },
    });
}
