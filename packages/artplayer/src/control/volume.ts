import type { ControlFactory, ControlOption } from './types'
import { appendElement } from '../component/dom'
import { getRect, isMobile, setStyle } from '../utils'
import { controlEvents } from './resources'

export default function volume(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control)
      const { icons } = art

      const $volume = appendElement($control, icons.volume)
      const $close = appendElement($control, icons.volumeClose)
      const $panel = appendElement($control, '<div class="art-volume-panel"></div>')
      const $inner = appendElement($panel, '<div class="art-volume-inner"></div>')
      const $value = appendElement($inner, `<div class="art-volume-val"></div>`)
      const $slider = appendElement($inner, `<div class="art-volume-slider"></div>`)
      const $handle = appendElement($slider, `<div class="art-volume-handle"></div>`)
      const $loaded = appendElement($handle, `<div class="art-volume-loaded"></div>`)
      const $indicator = appendElement($slider, `<div class="art-volume-indicator"></div>`)

      function getVolumeFromEvent(event: MouseEvent) {
        const { top, height } = getRect($slider)
        return 1 - (event.clientY - top) / height
      }

      function update() {
        if (art.muted || art.volume === 0) {
          setStyle($volume, 'display', 'none')
          setStyle($close, 'display', 'flex')
          setStyle($indicator, 'top', '100%')
          setStyle($loaded, 'top', '100%')
          $value.textContent = '0'
        }
        else {
          const percentage = art.volume * 100
          setStyle($volume, 'display', 'flex')
          setStyle($close, 'display', 'none')
          setStyle($indicator, 'top', `${100 - percentage}%`)
          setStyle($loaded, 'top', `${100 - percentage}%`)
          $value.textContent = String(Math.floor(percentage))
        }
      }

      update()
      on('video:volumechange', update)

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

        proxy($slider, 'mousedown', (event) => {
          isDragging = event.button === 0
          art.volume = getVolumeFromEvent(event)
        })

        on('document:mousemove', (event) => {
          if (isDragging) {
            art.muted = false
            art.volume = getVolumeFromEvent(event)
          }
        })

        on('document:mouseup', () => {
          if (isDragging) {
            isDragging = false
          }
        })
      }
    },
  })
}
