
import pipEnter from "./icon/pipEnter.json"
import pipLeave from "./icon/pipLeave.json"
import { createAnimation } from "./utils"

export default function pip(option) {
    return art => ({
        ...option,
        tooltip: art.i18n.get('PIP Mode'),
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

            const $pipEnterDom = append($control, getIcon("pipEnter"));
            const $pipLeaveDom = append($control, getIcon("pipLeave"));

            setStyle($pipLeaveDom, "display", "none");

            const pipEnterAnimation = createAnimation({
                name: "pipEnter",
                dom: $pipEnterDom,
                json: pipEnter,
            });

            const pipLeaveAnimation = createAnimation({
                name: "pipLeave",
                dom: $pipLeaveDom,
                json: pipLeave,
            });
            const pipMouseEnter = () => {
                art.pip ? pipLeaveAnimation.play() : pipEnterAnimation.play();
            };
            const pipEnterComplete = () => {
                pipEnterAnimation.stop();
            };
            const pipLeaveComplete = () => {
                pipLeaveAnimation.stop();
            };
            if (isMobile) {
                proxy($control, "touchstart", pipMouseEnter);
            } else {
                proxy($control, "mouseenter", pipMouseEnter);
            }
            proxy($control, 'click', () => {
                art.pip = !art.pip
            })
            pipEnterAnimation.addEventListener("complete", pipEnterComplete);
            pipLeaveAnimation.addEventListener("complete", pipLeaveComplete);
            art.on("pip", (value) => {
                tooltip($control, i18n.get(value ? 'Exit PIP Mode' : 'PIP Mode'))
                if (value) {
                    tooltip($control, i18n.get('Exit PIP Mode'))
                    setStyle($pipEnterDom, "display", "none");
                    setStyle($pipLeaveDom, "display", "inline-flex");
                } else {
                    tooltip($control, i18n.get('PIP Mode'))
                    setStyle($pipEnterDom, "display", "inline-flex");
                    setStyle($pipLeaveDom, "display", "none");
                }
            });
            art.on("destroy", () => {
                pipEnterAnimation.destroy();
                pipLeaveAnimation.destroy();
            });
        },
    })
}
