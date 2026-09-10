import type Artplayer from 'artplayer'
import type { Bar, Option, Result } from './types'
import { normalizeChapters } from './chapters'
import { createProgress } from './progress'
import { installStyle } from './stylesheet'

export default function artplayerPluginChapter(option: Option = {}) {
  return (art: Artplayer): Result => {
    const player = art.template.$player
    const inner = art.query<HTMLElement>('.art-control-progress-inner')
    if (!inner)
      throw new Error('Missing ArtPlayer progress container')
    const className = 'artplayer-plugin-chapter'
    let progress: ReturnType<typeof createProgress> | undefined = createProgress(inner)

    function update(chapters?: Option['chapters']) {
      if (!progress || art.isDestroy)
        return
      progress.clear()
      player.classList.remove(className)
      const normalized = normalizeChapters(chapters, art.duration)
      if (!normalized.length)
        return
      progress.render(normalized, art.duration)
      player.classList.add(className)
      art.emit('setBar', 'loaded', art.loaded || 0)
    }

    function setBar(type: Bar, percentage: number) {
      if (!art.isDestroy)
        progress?.setBar(type, percentage, art.duration)
    }

    function initialize() {
      update(option.chapters)
    }

    function destroy() {
      art.off('setBar', setBar)
      art.off('video:loadedmetadata', initialize)
      art.off('destroy', destroy)
      progress?.destroy()
      progress = undefined
      player.classList.remove(className)
    }

    art.on('setBar', setBar)
    art.once('video:loadedmetadata', initialize)
    art.on('destroy', destroy)
    return { name: 'artplayerPluginChapter', update: ({ chapters }) => update(chapters) }
  }
}

installStyle()
