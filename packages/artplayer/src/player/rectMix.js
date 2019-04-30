export default function rectMix(art, player) {
    Object.defineProperty(player, 'rect', {
        get: () => {
            return art.template.$player.getBoundingClientRect();
        },
    });

    ['bottom', 'height', 'left', 'right', 'top', 'width', 'x', 'y'].forEach(key => {
        Object.defineProperty(player, key, {
            get: () => {
                return player.rect[key];
            },
        });
    });
}
