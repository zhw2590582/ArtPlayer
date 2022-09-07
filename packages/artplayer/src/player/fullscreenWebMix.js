import { addClass, removeClass, hasClass, def } from '../utils';

export default function fullscreenWebMix(art) {
    const {
        notice,
        template: { $player },
    } = art;

    def(art, 'fullscreenWeb', {
        get() {
            return hasClass($player, 'art-fullscreen-web');
        },
        set(value) {
            if (value) {
                art.normalSize = 'fullscreenWeb';
                addClass($player, 'art-fullscreen-web');
                art.aspectRatioReset = true;
                art.autoSize = false;
                art.emit('resize');
                art.emit('fullscreenWeb', true);
                notice.show = '';
            } else {
                removeClass($player, 'art-fullscreen-web');
                art.aspectRatioReset = true;
                art.autoSize = art.option.autoSize;
                art.emit('resize');
                art.emit('fullscreenWeb', false);
                notice.show = '';
            }
        },
    });
}
