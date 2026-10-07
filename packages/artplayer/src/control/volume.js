import { append, clamp, getRect, isMobile, setStyle } from '../utils'

export default function volume(option) {
  return art => ({
    ...option,
    mounted: ($control) => {
      const { proxy, icons } = art
      const { $video } = art.template

      const $volume = append($control, icons.volume)
      const $close = append($control, icons.volumeClose)
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

      function update() {
        if (art.muted || art.volume === 0) {
          setStyle($volume, 'display', 'none')
          setStyle($close, 'display', 'flex')
          setStyle($indicator, 'top', '100%')
          setStyle($loaded, 'top', '100%')
          $value.textContent = 0
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
      })

      proxy($close, 'click', () => {
        art.muted = false
      })

      if (isMobile) {
        setStyle($panel, 'display', 'none')
      }
      else {
        let isDragging = false

        // Drag updates the element directly so the notice and localStorage
        // write only happen once when the drag finishes. The element fires
        // volumechange itself, which drives the control's update().
        const setVideoVolume = (value) => {
          $video.volume = clamp(value, 0, 1)
        }

        proxy($slider, 'mousedown', (event) => {
          isDragging = event.button === 0
          if (isDragging) {
            art.muted = false
            setVideoVolume(getVolumeFromEvent(event))
          }
        })

        art.on('document:mousemove', (event) => {
          if (isDragging) {
            setVideoVolume(getVolumeFromEvent(event))
          }
        })

        art.on('document:mouseup', () => {
          if (isDragging) {
            isDragging = false
            art.volume = $video.volume
          }
        })
      }
    },
  })
}
