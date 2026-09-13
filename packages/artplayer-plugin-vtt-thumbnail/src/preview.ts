import type { Events } from 'artplayer'
import type { PreviewOptions, StyleKey, Thumbnail } from './types'
import { findThumbnail } from './parseVtt'

export default function createPreview({ lifetime, thumbnails, progress, duration, setStyle, isMobile }: PreviewOptions) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let generation = 0
  lifetime.own(() => {
    generation++
    if (timer !== null) {
      const previous = timer
      timer = null
      clearTimeout(previous)
    }
  })
  function style(control: HTMLElement, key: StyleKey, value: string | number) {
    if (!lifetime.closed)
      setStyle<keyof CSSStyleDeclaration>(control, key, value)
  }
  function show(control: HTMLElement, cue: Thumbnail, width: number) {
    style(control, 'backgroundImage', `url(${cue.url})`)
    style(control, 'height', `${cue.h}px`)
    style(control, 'width', `${cue.w}px`)
    style(control, 'backgroundPosition', `-${cue.x}px -${cue.y}px`)
    if (width <= Number(cue.w) / 2)
      style(control, 'left', 0)
    else if (width > progress.clientWidth - Number(cue.w) / 2)
      style(control, 'left', `${progress.clientWidth - Number(cue.w)}px`)
    else
      style(control, 'left', `${width - Number(cue.w) / 2}px`)
  }
  return (control: HTMLElement) => async (type: Events['setBar'][0], percentage: number, event?: Event) => {
    if (lifetime.closed)
      return
    const dragging = type === 'played' && event && isMobile
    if (type !== 'hover' && !dragging)
      return
    const width = progress.clientWidth * percentage
    const second = percentage * duration()
    style(control, 'display', 'flex')
    if (lifetime.closed)
      return
    const cue = findThumbnail(thumbnails, second)
    if (!cue)
      return style(control, 'display', 'none')
    if (width > 0 && width < progress.clientWidth)
      show(control, cue, width)
    else if (!isMobile)
      style(control, 'display', 'none')
    if (dragging && !lifetime.closed) {
      const current = ++generation
      if (timer !== null)
        clearTimeout(timer)
      if (lifetime.closed)
        return
      const id = setTimeout(() => {
        if (current !== generation || lifetime.closed)
          return
        timer = null
        style(control, 'display', 'none')
      }, 500)
      if (lifetime.closed || current !== generation)
        clearTimeout(id)
      else
        timer = id
    }
  }
}
