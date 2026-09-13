import type Artplayer from 'artplayer'
import type { RuntimeFactory } from '../types/artplayer-plugin-multiple-subtitles'
import type { Option, Result, Track } from './types'
import installCaptionView from './caption'
import createLifetime from './lifetime'
import { parseTracks, serializeTracks } from './merge'
import createRenderer from './render'
import loadVtt from './request'

function artplayerPluginMultipleSubtitles({ subtitles = [] }: Option) {
  return async (art: Artplayer): Promise<Result> => {
    const { unescape, getExt, srtToVtt, assToVtt } = (art.constructor as typeof Artplayer).utils
    const lifetime = createLifetime(art)
    const render = createRenderer(art, lifetime, unescape)
    let trees: Track[] = []
    function setTracks(selected: readonly (Track | undefined)[]): void {
      if (!lifetime.closed)
        render(serializeTracks(selected))
    }
    const result: Result = {
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
      // A live completed request yields text; cancellation was checked above.
      trees = parseTracks(vtts as string[], subtitles)
      installCaptionView(art, lifetime)
      setTracks(trees)
      return result
    }
    catch (error) {
      lifetime.dispose()
      throw error
    }
  }
}

export default Object.assign(artplayerPluginMultipleSubtitles, { default: artplayerPluginMultipleSubtitles }) as RuntimeFactory
