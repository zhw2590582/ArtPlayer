import { addClass, removeClass, hasClass, def } from '../utils';

export default function fullscreenWebMix(art) {
    const { $player } = art.template;

    def(art, 'fullscreenWeb', {
        get() {
            return hasClass($player, 'art-fullscreen-web');
        },
        set(value) {
            if (value) {
                addClass($player, 'art-fullscreen-web');
                art.aspectRatioReset = true;
                art.autoSize = false;
                art.emit('resize');
                art.emit('fullscreenWeb', true);
            } else {
                removeClass($player, 'art-fullscreen-web');
                art.aspectRatioReset = true;
                art.autoSize = art.option.autoSize;
                art.emit('resize');
                art.emit('fullscreenWeb');
            }
        },
    });
}
