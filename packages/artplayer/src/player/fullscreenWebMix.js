import { addClass, removeClass, hasClass, def, append, setStyle } from '../utils';

export default function fullscreenWebMix(art) {
    const {
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
                setStyle($player, 'width', '100%');
                setStyle($player, 'height', '100%');
                addClass($player, 'art-fullscreen-web');
                art.emit('fullscreenWeb', true);
            } else {
                if (constructor.FULLSCREEN_WEB_IN_BODY) {
                    append($container, $player);
                }
                if (cssText) {
                    $player.style.cssText = cssText;
                    cssText = '';
                }
                removeClass($player, 'art-fullscreen-web');
                art.emit('fullscreenWeb', false);
            }

            art.emit('resize');
        },
    });
}
