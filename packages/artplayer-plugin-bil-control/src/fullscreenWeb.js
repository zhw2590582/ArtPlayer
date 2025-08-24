import webscreenEnter from "./icon/webscreenEnter.json"
import webscreenLeave from "./icon/webscreenLeave.json"
import { createAnimation } from "./utils"

export default function fullscreenWeb(option) {
    return art => ({
        ...option,
        tooltip: art.i18n.get('Web Fullscreen'),
        mounted: ($control) => {
            const { proxy, i18n, constructor: {
                utils: {
                    append,
                    isMobile,
                    getIcon,
                    setStyle,
                    tooltip
                },
            } } = art
            const $webscreenEnterDom = append(
                $control,
                getIcon("webscreenEnter")
            );
            const $webscreenLeaveDom = append(
                $control,
                getIcon("webscreenLeave")
            );
            setStyle($webscreenLeaveDom, "display", "none");
            const webscreenEnterAnimation = createAnimation({
                name: "webscreenEnter",
                dom: $webscreenEnterDom,
                json: webscreenEnter,
            });

            const webscreenLeaveAnimation = createAnimation({
                name: "webscreenLeave",
                dom: $webscreenLeaveDom,
                json: webscreenLeave,
            });

            const webscreenMouseEnter = () => {
                art.fullscreenWeb
                    ? webscreenLeaveAnimation.play()
                    : webscreenEnterAnimation.play();
            };
            const webscreenEnterComplete = () => {
                webscreenEnterAnimation.stop();
            };
            const webscreenLeaveComplete = () => {
                webscreenLeaveAnimation.stop();
            };
            if (isMobile) {
                proxy($control, "touchstart", webscreenMouseEnter);
            } else {
                proxy($control, "mouseenter", webscreenMouseEnter);
            }

            proxy($control, 'click', () => {
                art.fullscreenWeb = !art.fullscreenWeb
            })
            webscreenEnterAnimation.addEventListener(
                "complete",
                webscreenEnterComplete
            );
            webscreenLeaveAnimation.addEventListener(
                "complete",
                webscreenLeaveComplete
            );
            art.on("fullscreenWeb", (value) => {
                if (value) {
                    tooltip($control, i18n.get('Exit Web Fullscreen'))
                    setStyle($webscreenEnterDom, "display", "none");
                    setStyle($webscreenLeaveDom, "display", "inline-flex");
                } else {
                    tooltip($control, i18n.get('Web Fullscreen'))
                    setStyle($webscreenEnterDom, "display", "inline-flex");
                    setStyle($webscreenLeaveDom, "display", "none");
                }
            });
            art.on("destroy", () => {
                webscreenLeaveAnimation.destroy();
                webscreenLeaveAnimation.destroy();
            });
        },
    })
}
