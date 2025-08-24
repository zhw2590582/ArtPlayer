import play from "./icon/pause-play.json"
import pause from "./icon/play-pause.json"
import { createAnimation } from "./utils"
export default function playAndPause(option) {
    return (art) => ({
        ...option,
        mounted: ($control) => {
            const { proxy, constructor: {
                utils: {
                    append,
                    getIcon,
                },
            } } = art
            let animation = null;
            const $playPause = append($control, getIcon("playPause"));

            const createplayPauseAnimation = (t) => {
                if (animation) {
                    animation.destroy(); // 销毁原有的 Animation 实例
                }
                animation = createAnimation({
                    name: "play",
                    dom: $playPause,
                    json: t ? play : pause,
                });
                return animation;
            };

            const toggleAnimation = () => {
                createplayPauseAnimation(art.playing).play();
            };
            proxy($playPause, "click", () => {
                if (!art.playing) {
                    art.play();
                } else {
                    art.pause();
                }
                toggleAnimation();
            });
            toggleAnimation(); // 初始化时切换动画状态
            art.on("video:play", () => {
                createplayPauseAnimation(true).play();
            });
            art.on("video:pause", () => {
                createplayPauseAnimation(false).play();
            });
            art.on("destroy", () => {
                animation.destroy();
            });
        },
    });
}