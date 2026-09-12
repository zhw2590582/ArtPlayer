import type EventTarget from './EventTarget'

export function publish(events: EventTarget, current: () => boolean, names: readonly string[]): void {
  for (const name of names) {
    if (!current())
      return
    events.emit(name)
  }
}

export function metadataBarrier(ready: () => void, current: () => boolean) {
  let video = false
  let audio = false
  let published = false
  function complete(part: 'audio' | 'video'): void {
    if (!current() || published)
      return
    if (part === 'video')
      video = true
    else audio = true
    if (video && audio) {
      published = true
      ready()
    }
  }
  return { video: () => complete('video'), audio: () => complete('audio') }
}
