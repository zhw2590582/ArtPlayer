
import fullScreen from './icon/fullScreen.json'
import { createAnimation } from './utils'


export default function fullscreen(option) {
    return art => ({
        ...option,
        tooltip: art.i18n.get('Fullscreen'),
        mounted: ($control) => {
            const { proxy, i18n, constructor: {
                utils: {
                    append,
                    isMobile,
                    getIcon,
                    tooltip
                },
            }, } = art

            const $fullscreenDom = append($control, getIcon("fullscreen"));
            const fullScreenAnimation = createAnimation({
                name: "fullscreen",
                dom: $fullscreenDom,
                json: fullScreen,
            });

            const stopAnimation = () => {
                fullScreenAnimation.stop();
            };
            const playAnimation = () => {
                fullScreenAnimation.play();
            };
            if (isMobile) {
                proxy($control, "touchstart", playAnimation);
            } else {
                proxy($control, "mouseenter", playAnimation);
            }
            proxy($control, 'click', () => {
                art.fullscreen = !art.fullscreen
            })
            fullScreenAnimation.addEventListener("complete", stopAnimation);
            art.on('fullscreen', (state) => {
                if (state) {
                    tooltip($control, i18n.get('Exit Fullscreen'))
                }
                else {
                    tooltip($control, i18n.get('Fullscreen'))
                }
            })
            art.on("destroy", () => {
                fullScreenAnimation.destroy();
            });
        }
    })
}
