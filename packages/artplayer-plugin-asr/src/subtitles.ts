export function createSubtitles(layer: HTMLElement, length: number, autoHideTimeout: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let destroyed = false

  function cancelTimer() {
    clearTimeout(timer)
    timer = undefined
  }

  function hide() {
    if (!destroyed)
      layer.style.display = 'none'
  }

  function append(subtitle: unknown) {
    if (destroyed || typeof subtitle !== 'string')
      return
    cancelTimer()
    timer = setTimeout(hide, autoHideTimeout)
    layer.style.display = ''
    layer.innerHTML = subtitle.split(/(?<=[、。！？!?.])\s*/u)
      .map(line => line.trim())
      .filter(Boolean)
      .slice(-length)
      .map(line => `<div class="art-asr-line">${line}</div>`)
      .join('')
  }

  return {
    append,
    hide,
    destroy() {
      destroyed = true
      cancelTimer()
    },
  }
}
