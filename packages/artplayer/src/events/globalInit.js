export default function globalInit(art, events) {
  const documentEvents = [
    'click',
    'mouseup',
    'keydown',
    'touchend',
    'touchmove',
    'mousemove',
    'pointerup',
    'contextmenu',
    'pointermove',
    'visibilitychange',
    'webkitfullscreenchange',
  ]

  const windowEvents = [
    'resize',
    'scroll',
    'orientationchange',
  ]

  const destroyEvents = []

  function bindGlobalEvents(source = {}) {
    for (let index = 0; index < destroyEvents.length; index++) {
      events.remove(destroyEvents[index])
    }

    destroyEvents.length = 0

    const { $player } = art.template

    documentEvents.forEach((name) => {
      const doc = source.document || $player.ownerDocument || document
      const destroy = events.proxy(doc, name, (event) => {
        art.emit(`document:${name}`, event)
      })
      destroyEvents.push(destroy)
    })

    windowEvents.forEach((name) => {
      const win = source.window || $player.ownerDocument?.defaultView || window
      const destroy = events.proxy(win, name, (event) => {
        art.emit(`window:${name}`, event)
      })
      destroyEvents.push(destroy)
    })
  }

  bindGlobalEvents()
  events.bindGlobalEvents = bindGlobalEvents
}
