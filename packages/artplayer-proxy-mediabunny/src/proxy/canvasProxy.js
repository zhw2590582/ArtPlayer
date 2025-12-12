import createMediabunnyVideoShim from '../shim/mediabunnyVideoShim.js'

export default function createCanvasProxy(art, option) {
  const { constructor } = art
  const { createElement } = constructor.utils

  const canvas = createElement('canvas')
  const ctx = canvas.getContext('2d')

  const shim = createMediabunnyVideoShim({
    art,
    canvas,
    ctx,
    option,
  })

  const originalCanvasMethods = {}
  for (const prop in canvas) {
    if (typeof canvas[prop] === 'function') {
      originalCanvasMethods[prop] = canvas[prop].bind(canvas)
    }
  }

  for (const prop in shim) {
    if (!(prop in canvas)) {
      Object.defineProperty(canvas, prop, {
        get() {
          const value = shim[prop]
          return typeof value === 'function' ? value.bind(shim) : value
        },
        set(v) {
          shim[prop] = v
        },
        configurable: true,
        enumerable: true,
      })
    }
  }

  for (const prop in originalCanvasMethods) {
    canvas[prop] = (...args) => originalCanvasMethods[prop](...args)
  }

  art.on('destroy', () => {
    shim.destroy()
  })

  function resize() {
    const player = art.template?.$player
    if (!player || art.option.autoSize)
      return

    Object.assign(canvas.style, {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    })
  }

  art.on('resize', resize)
  art.on('video:loadedmetadata', resize)

  return canvas
}
