import settingJson from './icon/setting.json'
import { createAnimation } from './utils'

export default function setting(option) {
    return art => ({
        ...option,
        tooltip: art.i18n.get('Show Setting'),
        mounted: ($control) => {
            const { proxy, i18n, constructor: {
                utils: {
                    append,
                    isMobile,
                    getIcon,
                    tooltip
                },
            } } = art


            const $settingDom = append($control, getIcon("setting"));
            const settingAnimation = createAnimation({
                name: "setting",
                dom: $settingDom,
                json: settingJson,
            });

            const stopAnimation = () => {
                settingAnimation.stop();
            };
            const playAnimation = () => {
                settingAnimation.play();
            };
            if (isMobile) {
                proxy($control, "touchstart", playAnimation);
            } else {
                proxy($control, "mouseenter", playAnimation);
            }
            proxy($control, 'click', () => {
                art.setting.toggle()
                art.setting.resize()
            })
            settingAnimation.addEventListener("complete", stopAnimation);
            art.on('setting', (value) => {
                tooltip($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'))
            })
            art.on("destroy", () => {
                settingAnimation.destroy();
            });
        },
    })
}
