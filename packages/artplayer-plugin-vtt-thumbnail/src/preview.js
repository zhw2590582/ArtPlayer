export default function createPreview({ lifetime, thumbnails, progress, duration, setStyle, isMobile }) {
  let timer = null
  let generation = 0
  lifetime.own(() => {
    generation++
    if (timer !== null) {
      const previous = timer
      timer = null
      clearTimeout(previous)
    }
  })
  function style(control, key, value) {
    if (!lifetime.closed)
      setStyle(control, key, value)
  }
  function show(control, cue, width) {
    style(control, 'backgroundImage', `url(${cue.url})`)
    style(control, 'height', `${cue.h}px`)
    style(control, 'width', `${cue.w}px`)
    style(control, 'backgroundPosition', `-${cue.x}px -${cue.y}px`)
    if (width <= cue.w / 2)
      style(control, 'left', 0)
    else if (width > progress.clientWidth - cue.w / 2)
      style(control, 'left', `${progress.clientWidth - cue.w}px`)
    else
      style(control, 'left', `${width - cue.w / 2}px`)
  }
  return control => async (type, percentage, event) => {
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
    const cue = thumbnails.find(item => second >= item.start && second <= item.end)
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
