export function createVideoEventTarget() {
  const listeners = new Map()

  function addEventListener(type, fn) {
    if (!listeners.has(type))
      listeners.set(type, [])
    listeners.get(type).push(fn)
  }

  function removeEventListener(type, fn) {
    const list = listeners.get(type)
    if (!list)
      return
    const i = list.indexOf(fn)
    if (i >= 0)
      list.splice(i, 1)
  }

  function emit(type, detail) {
    const evt = new Event(type)
    evt.detail = detail
    const list = listeners.get(type)
    if (list)
      list.forEach(fn => fn(evt))
  }

  return { addEventListener, removeEventListener, emit }
}
