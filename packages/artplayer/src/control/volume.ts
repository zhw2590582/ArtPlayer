import type { ControlFactory, ControlOption } from './types'
import { keyboardButton } from '../accessibility/button'
import { keyboardSlider } from '../accessibility/slider'
import { appendElement } from '../component/dom'
import { entryScope } from '../component/resources'
import { isClosing } from '../lifecycle/instance'
import { getRect, isMobile, setStyle } from '../utils'
import { controlEvents } from './resources'

export default function volume(option: ControlOption): ControlFactory {
  return art => ({
    ...option,
    mounted: ($control) => {
      const { on, proxy } = controlEvents(art, $control)
      const { icons, i18n } = art

      const $volume = appendElement($control, icons.volume)
      const $close = appendElement($control, icons.volumeClose)
      for (const element of [$volume, $close]) {
        keyboardButton(entryScope($control), element)
        element.setAttribute('aria-label', i18n.get('Mute'))
      }
      const $panel = appendElement($control, '<div class="art-volume-panel"></div>')
      const $inner = appendElement($panel, '<div class="art-volume-inner"></div>')
      const $value = appendElement($inner, `<div class="art-volume-val"></div>`)
      const $slider = appendElement($inner, `<div class="art-volume-slider"></div>`)
      const $handle = appendElement($slider, `<div class="art-volume-handle"></div>`)
      const $loaded = appendElement($handle, `<div class="art-volume-loaded"></div>`)
      const $indicator = appendElement($slider, `<div class="art-volume-indicator"></div>`)
      const scope = entryScope($control)
      let revision = 0
      const updateSlider = keyboardSlider(scope, $slider, i18n.get('Volume'), () => ({
        min: 0,
        max: 100,
        value: art.muted ? 0 : art.volume * 100,
        step: art.constructor.VOLUME_STEP * 100,
        text: value => `${Math.round(value)}%`,
      }), (value) => {
        const action = ++revision
        art.muted = false
        if (action === revision && !scope.closed && !isClosing(art))
          art.volume = value / 100
      }, 'vertical')

      function getVolumeFromEvent(event: MouseEvent) {
        const { top, height } = getRect($slider)
        return 1 - (event.clientY - top) / height
      }

      function update() {
        updateSlider()
        const focused = $control.ownerDocument.activeElement
        const muted = art.muted || art.volume === 0
        const visible = muted ? $close : $volume
        $volume.setAttribute('aria-pressed', String(art.muted))
        $close.setAttribute('aria-pressed', String(art.muted))
        if (muted) {
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
        if ((focused === $volume || focused === $close) && focused !== visible)
          visible.focus({ preventScroll: true })
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
