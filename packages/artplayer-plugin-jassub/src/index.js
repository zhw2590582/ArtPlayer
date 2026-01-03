import JASSUB from './jassub.es.js'

export default function artplayerPluginJassub(option) {
  return (art) => {
    const instance = new JASSUB({
      video: art.video,
      ...option,
    })

    instance._canvasParent.style.zIndex = 20

    art.on('destroy', () => {
      instance.destroy()
    })

    return {
      name: 'artplayerPluginJassub',
      instance,
    }
  }
}

if (typeof window !== 'undefined') {
  window.artplayerPluginJassub = artplayerPluginJassub
}
