import style from 'bundle-text:./style.less';
import loadingJson from "./icon/loading.json"
import { createAnimation } from "./utils"
import fullscreen from './fullscreen';
import fullscreenWeb from "./fullscreenWeb";
import setting from './setting';
import pip from './pip';
import volume from "./volume"
import playAndPause from "./playAndPause"

export default function artplayerPluginBilControl(option) {
    return (art) => {
        const {
            option,
            controls,
            template: { $loading },
            constructor: {
                utils: {
                    isMobile,
                    query,
                },
            },
        } = art;

        const $loadingDom = query(".art-icon-loading", $loading)
        $loadingDom.innerHTML = ""
        createAnimation({
            name: "loading",
            dom: $loadingDom,
            json: loadingJson,
            loop: true,
            autoplay: true,
        });

        controls.remove("playAndPause");
        controls.add(
            playAndPause({
                name: "playAndPause",
                position: "left",
                index: 20,
            })
        );
        controls.remove("volume");
        if (!isMobile) {
            controls.add(
                volume({
                    name: 'volume',
                    position: 'right',
                    index: 20,
                }),
            )
        }
        if (option.fullscreen) {
            controls.remove("fullscreen");
            controls.add(
                fullscreen({
                    name: 'fullscreen',
                    position: 'right',
                    index: 70,
                }),
            )
        }

        if (option.setting) {
            controls.remove("setting");
            controls.add(
                setting({
                    name: 'setting',
                    position: 'right',
                    index: 30,
                }),
            )
        }

        if (option.fullscreenWeb) {
            controls.remove("fullscreenWeb");
            controls.add(
                fullscreenWeb({
                    name: 'fullscreenWeb',
                    position: 'right',
                    index: 60,
                }),
            )
        }

        if (option.pip) {
            controls.remove("pip");
            controls.add(
                pip({
                    name: 'pip',
                    position: 'right',
                    index: 40,
                }),
            )
        }
        return {
            name: 'artplayerPluginBilControl',
        };
    };
}

if (typeof document !== 'undefined') {
    const id = 'artplayer-plugin-bil-control';
    const $style = document.getElementById(id);
    if ($style) {
        $style.textContent = style;
    } else {
        const $style = document.createElement('style');
        $style.id = id;
        $style.textContent = style;
        document.head.appendChild($style);
    }
}

if (typeof window !== 'undefined') {
    window['artplayerPluginBilControl'] = artplayerPluginBilControl;
}
