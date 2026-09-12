import type { Label, SelectorItem, SetupOptions } from './m3u8-types'
import $audio from '../../artplayer-plugin-hls-control/src/audio.svg?raw'
import $quality from '../../artplayer-plugin-hls-control/src/quality.svg?raw'
import createMenu, { releaseAll } from './m3u8-menu'
import { audioModel, qualityModel } from './m3u8-model'

export function setupM3u8Controls({ art, shim, option }: SetupOptions) {
  if (!option.m3u8)
    return
  let closed = false
  let revision = 0
  let selection = 0
  const quality = createMenu(art, 'mediabunny-quality', $quality)
  const audio = createMenu(art, 'mediabunny-audio', $audio)
  const current = (source: number) => !closed && !shim.engine.destroyed && shim.engine.loadSeq === source

  async function update(): Promise<void> {
    if (closed || shim.engine.destroyed)
      return
    const version = ++revision
    const source = shim.engine.loadSeq
    const active = () => version === revision && current(source)
    try {
      const state = await shim.getM3u8State()
      if (!active())
        return
      const qualityConfig = option.m3u8?.quality || {}
      const qualityView = qualityModel(state, qualityConfig, active)
      if (!active())
        return
      quality.update(qualityView, qualityConfig, () => current(source), (item, title) => select('quality', item, title))
      if (!active())
        return
      const audioConfig = option.m3u8?.audio || {}
      const audioView = audioModel(state, audioConfig, active)
      if (active())
        audio.update(audioView, audioConfig, () => current(source), (item, title) => select('audio', item, title))
    }
    catch (error) {
      if (active())
        throw error
    }
  }

  async function select(kind: 'quality' | 'audio', item: SelectorItem, title: string): Promise<Label> {
    const intent = ++selection
    const source = shim.engine.loadSeq
    revision++
    const active = () => intent === selection && current(source)
    try {
      if (kind === 'quality')
        await shim.switchM3u8Quality(item.value)
      else
        await shim.switchM3u8Audio(item.value)
      if (active()) {
        await update()
        if (active())
          art.notice.show = `${title}: ${item.html}`
      }
    }
    catch (error) {
      if (active()) {
        await refresh()
        if (active())
          throw error
      }
    }
    return item.html
  }

  function refresh(): Promise<void> {
    return update().catch(error => console.warn('MediaBunny HLS menu update:', error))
  }
  function invalidate(): void {
    revision++
    selection++
    try {
      releaseAll([quality.clear, audio.clear])
    }
    catch (error) { console.warn('MediaBunny HLS menu cleanup:', error) }
  }
  function destroy(): void {
    if (closed)
      return
    closed = true
    invalidate()
    try {
      releaseAll([
        () => art.off('video:loadedmetadata', refresh),
        () => art.off('restart', refresh),
        () => art.off('video:loadstart', invalidate),
        () => art.off('video:error', invalidate),
        () => art.off('destroy', destroy),
      ])
    }
    catch (error) { console.warn('MediaBunny HLS listener cleanup:', error) }
  }
  art.on('video:loadedmetadata', refresh)
  art.on('restart', refresh)
  art.on('video:loadstart', invalidate)
  art.on('video:error', invalidate)
  art.on('destroy', destroy)
  return { update }
}
