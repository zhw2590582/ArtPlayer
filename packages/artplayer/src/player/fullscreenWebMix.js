import { addClass, removeClass, hasClass, def, append } from '../utils';

export default function fullscreenWebMix(art) {
    const {
        option,
        notice,
        constructor,
        template: { $container, $player },
    } = art;

    let cssText = '';
    def(art, 'fullscreenWeb', {
        get() {
            return hasClass($player, 'art-fullscreen-web');
        },
        set(value) {
            if (value) {
                cssText = $player.style.cssText;
                if (constructor.FULLSCREEN_WEB_IN_BODY) {
                    append(document.body, $player);
                }
                art.state = 'fullscreenWeb';
                addClass($player, 'art-fullscreen-web');
                art.aspectRatioReset();
                art.autoSize = false;
                art.emit('resize');
                art.emit('fullscreenWeb', true);
                notice.show = '';
            } else {
                if (constructor.FULLSCREEN_WEB_IN_BODY) {
                    append($container, $player);
                }
                if (cssText) {
                    $player.style.cssText = cssText;
                    cssText = '';
                }
                removeClass($player, 'art-fullscreen-web');
                art.aspectRatioReset();
                art.autoSize = option.autoSize;
                art.emit('resize');
                art.emit('fullscreenWeb', false);
                notice.show = '';
            }
        },
    });
}
