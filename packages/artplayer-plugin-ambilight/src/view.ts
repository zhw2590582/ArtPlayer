import type Artplayer from 'artplayer'

type Utilities = Pick<typeof Artplayer.utils, 'createElement' | 'addClass'> & {
  // Historical setStyles accepts numeric CSS values; preserve its original arguments.
  setStyles: (element: HTMLElement, styles: object) => unknown
}
interface ViewOptions { blur: string, opacity: number, duration: number }

export function createAmbilightView(utils: Utilities) {
  const element = utils.createElement('div')
  element.innerHTML = Array.from({ length: 9 }).fill('<div></div>').join('')
  const items = Array.from(element.children) as HTMLElement[]

  function mount(video: HTMLVideoElement, option: ViewOptions, active: () => boolean) {
    if (!active())
      return
    utils.addClass(element, 'artplayer-plugin-ambilight')
    if (!active())
      return
    video.parentNode!.insertBefore(element, video)
    if (!active())
      return
    utils.setStyles(element, { position: 'absolute', top: 0, left: 0, zIndex: 9, inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr' })
    for (const item of items) {
      if (!active())
        return
      utils.setStyles(item, { opacity: option.opacity, filter: `blur(${option.blur})`, transition: `background-color ${option.duration}s ease` })
    }
  }

  function render(colors: string[], active: () => boolean) {
    for (let index = 0; index < colors.length; index++) {
      if (!active())
        return
      const item = items[index]
      const color = colors[index]
      if (item && color !== undefined)
        item.style.backgroundColor = color
    }
  }

  function destroy() {
    try {
      element.parentNode?.removeChild(element)
    }
    finally { items.length = 0 }
  }
  return { mount, render, destroy }
}
