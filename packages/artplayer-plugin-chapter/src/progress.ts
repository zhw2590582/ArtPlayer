import type { Bar, Chapter } from './types'

interface Segment {
  start: number
  end: number
  title: string
  bars: Record<Bar, HTMLDivElement>
}

export function createProgress(inner: HTMLElement) {
  const create = (parent: HTMLElement, className: string) => {
    const element = inner.ownerDocument.createElement('div')
    element.className = className
    parent.appendChild(element)
    return element
  }
  const control = create(inner, 'art-chapters')
  const title = create(inner, 'art-chapter-title')
  let segments: Segment[] = []

  function clearTitle() {
    title.textContent = ''
    title.style.left = '0px'
    title.style.visibility = 'hidden'
  }

  function clear() {
    segments = []
    control.textContent = ''
    clearTitle()
  }

  function render(chapters: Chapter[], duration: number) {
    segments = chapters.map((chapter) => {
      const element = create(control, 'art-chapter')
      const body = create(element, 'art-chapter-inner')
      const length = chapter.end - chapter.start
      element.dataset.start = String(chapter.start)
      element.dataset.end = String(chapter.end)
      element.dataset.duration = String(length)
      element.dataset.title = chapter.title.trim()
      element.style.width = `${length / duration * 100}%`
      return {
        start: chapter.start,
        end: chapter.end,
        title: chapter.title.trim(),
        bars: {
          hover: create(body, 'art-progress-hover'),
          loaded: create(body, 'art-progress-loaded'),
          played: create(body, 'art-progress-played'),
        },
      }
    })
  }

  function setBar(type: Bar, percentage: number, duration: number) {
    if (type !== 'hover' && type !== 'loaded' && type !== 'played')
      return
    if (!Number.isFinite(percentage))
      return
    const currentTime = duration * percentage
    let hovered: Segment | undefined
    for (const segment of segments) {
      const target = segment.bars[type]
      target.style.width = currentTime < segment.start
        ? '0px'
        : currentTime > segment.end
          ? '100%'
          : `${(currentTime - segment.start) / (segment.end - segment.start) * 100}%`
      if (currentTime >= segment.start && currentTime <= segment.end)
        hovered = segment
    }
    if (type !== 'hover')
      return

    clearTitle()
    const width = control.clientWidth * percentage
    if (hovered?.title && width > 0) {
      title.textContent = hovered.title
      title.style.visibility = 'visible'
      title.style.left = `${Math.max(0, Math.min(width - title.clientWidth / 2, inner.clientWidth - title.clientWidth))}px`
    }
  }

  function destroy() {
    clear()
    control.remove()
    title.remove()
  }

  clearTitle()
  return { clear, render, setBar, destroy }
}
