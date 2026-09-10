import type { ControlHost } from '../types'
import type { ProgressEvent } from './position'
import { queryElement } from '../../component/dom'
import { entryScope } from '../../component/resources'
import { timeout } from '../../lifecycle/resources'
import { addClass, append, clamp, includeFromEvent, isMobile, removeClass, secondToTime, setStyle } from '../../utils'
import { controlEvents } from '../resources'
import { getPosFromEvent } from './position'

export function mountProgressView(art: ControlHost, $control: HTMLDivElement): void {
  const { icons, option } = art
  const { $player } = art.template
  const scope = entryScope($control)
  const { on } = controlEvents(art, $control)
  let cancelTip = () => {}

  const $hover = queryElement('.art-progress-hover', $control)
  const $loaded = queryElement('.art-progress-loaded', $control)
  const $played = queryElement('.art-progress-played', $control)
  const $highlight = queryElement('.art-progress-highlight', $control)
  const $indicator = queryElement('.art-progress-indicator', $control)
  const $tip = queryElement('.art-progress-tip', $control)

  if (icons.indicator) {
    append($indicator, icons.indicator)
  }
  else {
    setStyle($indicator, 'backgroundColor', 'var(--art-theme)')
  }

  function showHighlight(event: ProgressEvent) {
    const { width } = getPosFromEvent(art, event)
    const text = event.target instanceof HTMLElement ? event.target.dataset.text : undefined
    $tip.textContent = text ?? ''
    const tipWidth = $tip.clientWidth
    if (width <= tipWidth / 2) {
      setStyle($tip, 'left', 0)
    }
    else if (width > $control.clientWidth - tipWidth / 2) {
      setStyle($tip, 'left', `${$control.clientWidth - tipWidth}px`)
    }
    else {
      setStyle($tip, 'left', `${width - tipWidth / 2}px`)
    }
  }

  function showTime(event: ProgressEvent, touch?: { width: number, time: string }) {
    const { width, time } = touch || getPosFromEvent(art, event)
    $tip.textContent = time || '00:00'
    const tipWidth = $tip.clientWidth
    if (width <= tipWidth / 2) {
      setStyle($tip, 'left', 0)
    }
    else if (width > $control.clientWidth - tipWidth / 2) {
      setStyle($tip, 'left', `${$control.clientWidth - tipWidth}px`)
    }
    else {
      setStyle($tip, 'left', `${width - tipWidth / 2}px`)
    }
  }

  function updateHighlight() {
    $highlight.textContent = ''
    for (let index = 0; index < option.highlight.length; index++) {
      const item = option.highlight[index]!
      const left = (clamp(item.time, 0, art.duration) / art.duration) * 100
      const marker = document.createElement('span')
      marker.dataset.text = item.text
      marker.dataset.time = String(item.time)
      marker.style.left = `${left}%`
      append($highlight, marker)
    }
  }

  function setBar(type: string, percentage: number, event?: ProgressEvent) {
    const isMobileDragging = type === 'played' && event && isMobile

    if (type === 'loaded') {
      setStyle($loaded, 'width', `${percentage * 100}%`)
    }

    if (type === 'hover') {
      setStyle($hover, 'width', `${percentage * 100}%`)

      if (includeFromEvent(event!, $highlight)) {
        showHighlight(event!)
      }
      else {
        showTime(event!)
      }

      if (percentage === 0) {
        removeClass($player, 'art-progress-hover')
      }
      else {
        addClass($player, 'art-progress-hover')
      }
    }

    if (type === 'played') {
      setStyle($played, 'width', `${percentage * 100}%`)
      setStyle($indicator, 'left', `${percentage * 100}%`)
    }

    if (isMobileDragging) {
      addClass($player, 'art-progress-hover')
      const width = $control.clientWidth * percentage
      const time = secondToTime(percentage * art.duration)
      showTime(event!, { width, time })
      cancelTip()
      cancelTip = timeout(scope, () => {
        removeClass($player, 'art-progress-hover')
      }, 500)
    }
  }

  on('setBar', setBar)
  on('video:loadedmetadata', updateHighlight)

  if (art.constructor.USE_RAF) {
    on('raf', () => {
      art.emit('setBar', 'played', art.played)
      art.emit('setBar', 'loaded', art.loaded)
    })
  }
  else {
    on('video:timeupdate', () => {
      art.emit('setBar', 'played', art.played)
    })

    on('video:progress', () => {
      art.emit('setBar', 'loaded', art.loaded)
    })

    on('video:ended', () => {
      art.emit('setBar', 'played', 1)
    })
  }

  art.emit('setBar', 'loaded', art.loaded || 0)
}
