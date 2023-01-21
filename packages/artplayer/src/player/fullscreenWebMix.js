import { addClass, removeClass, hasClass, def, append } from '../utils';

export default function fullscreenWebMix(art) {
    const {
        notice,
        constructor,
        template: { $container, $player },
    } = art;

    def(art, 'fullscreenWeb', {
        get() {
            return hasClass($player, 'art-fullscreen-web');
        },
        set(value) {
            if (value) {
                if (constructor.FULLSCREEN_WEB_IN_BODY) {
                    append(document.body, $player);
                }
                art.normalSize = 'fullscreenWeb';
                addClass($player, 'art-fullscreen-web');
                art.aspectRatioReset = true;
                art.autoSize = false;
                art.emit('resize');
                art.emit('fullscreenWeb', true);
                notice.show = '';
            } else {
                if (constructor.FULLSCREEN_WEB_IN_BODY) {
                    append($container, $player);
                }
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
