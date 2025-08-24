
import volume from './icon/volume.json'
import mute from './icon/mute.json'
import { createAnimation } from './utils'

export default function volume(option) {
    return art => ({
        ...option,
        mounted: ($control) => {
            const { proxy, constructor: {
                utils: {
                    append,
                    getIcon,
                    setStyle,
                    getRect
                },
            } } = art
            let isDragging = false
            const $volume = append($control, getIcon('volume'))
            const $close = append($control, getIcon('volumeClose'))
            const $panel = append($control, '<div class="art-volume-panel"></div>')
            const $inner = append($panel, '<div class="art-volume-inner"></div>')
            const $value = append($inner, `<div class="art-volume-val"></div>`)
            const $slider = append($inner, `<div class="art-volume-slider"></div>`)
            const $handle = append($slider, `<div class="art-volume-handle"></div>`)
            const $loaded = append($handle, `<div class="art-volume-loaded"></div>`)
            const $indicator = append($slider, `<div class="art-volume-indicator"></div>`)

            function getVolumeFromEvent(event) {
                const { top, height } = getRect($slider)
                return 1 - (event.clientY - top) / height
            }
            const volumeAnimation = createAnimation({
                name: "volume",
                dom: $volume,
                json: volume,
            });
            const muteAnimation = createAnimation({
                name: "mute",
                dom: $close,
                json: mute,
            });

            function update() {
                if (art.muted || art.volume === 0) {
                    setStyle($volume, 'display', 'none')
                    setStyle($close, 'display', 'flex')
                    setStyle($indicator, 'top', '100%')
                    setStyle($loaded, 'top', '100%')
                    $value.textContent = 0
                    muteAnimation.play()
                }
                else {
                    const percentage = art.volume * 100
                    setStyle($volume, 'display', 'flex')
                    setStyle($close, 'display', 'none')
                    setStyle($indicator, 'top', `${100 - percentage}%`)
                    setStyle($loaded, 'top', `${100 - percentage}%`)
                    $value.textContent = Math.floor(percentage)
                }
            }

            update()
            art.on('video:volumechange', update)

            proxy($volume, 'click', () => {
                art.muted = true
                volumeMouseEnter()

            })

            proxy($close, 'click', () => {
                art.muted = false
                volumeMouseEnter()
            })

            const volumeMouseEnter = () => {
                art.muted ? muteAnimation.play() : volumeAnimation.play();
            };
            const volumeComplete = () => {
                volumeAnimation.stop();
            };
            const muteComplete = () => {
                muteAnimation.stop();
            };

            proxy($control, "mouseenter", volumeMouseEnter);

            volumeAnimation.addEventListener("complete", volumeComplete);
            muteAnimation.addEventListener("complete", muteComplete);

            proxy($slider, 'mousedown', (event) => {
                isDragging = event.button === 0
                art.volume = getVolumeFromEvent(event)
            })

            art.on('document:mousemove', (event) => {
                if (isDragging) {
                    art.muted = false
                    art.volume = getVolumeFromEvent(event)
                }
            })

            art.on('document:mouseup', () => {
                if (isDragging) {
                    isDragging = false
                }
            })

            art.on("destroy", () => {
                volumeAnimation.destroy();
                muteAnimation.destroy();
            });
        },
    })
}
