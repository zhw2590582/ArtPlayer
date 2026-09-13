import createLifetime from './lifetime'
import { parseTracks, serializeTracks } from './merge'
import createRenderer from './render'
import loadVtt from './request'

export default function artplayerPluginMultipleSubtitles({ subtitles = [] }) {
  return async (art) => {
    const { unescape, getExt, srtToVtt, assToVtt } = art.constructor.utils
    const lifetime = createLifetime(art)
    const render = createRenderer(art, lifetime, unescape)
    let trees = []
    function setTracks(selected) {
      if (!lifetime.closed)
        render(serializeTracks(selected))
    }
    const result = {
      name: 'multipleSubtitles',
      tracks(names = []) {
        if (!lifetime.closed)
          setTracks(names.map(name => trees.find(tree => tree.name === name)))
      },
      reset() {
        setTracks(trees)
      },
    }
    try {
      if (lifetime.closed)
        return result
      const vtts = await Promise.all(subtitles.map(option => loadVtt(option, { getExt, srtToVtt, assToVtt }, lifetime)))
      if (lifetime.closed)
        return result
      trees = parseTracks(vtts, subtitles)
      setTracks(trees)
      return result
    }
    catch (error) {
      lifetime.dispose()
      throw error
    }
  }
}
