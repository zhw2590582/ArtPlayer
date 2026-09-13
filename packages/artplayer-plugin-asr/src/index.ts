import type Artplayer from 'artplayer'
import type { AsrOptions, AsrResult } from './types'
import { Capture } from './capture'
import style from './style.less?inline'
import { createSubtitles } from './subtitles'

export default function artplayerPluginAsr(option: AsrOptions = {}) {
  const { length = 3, interval = 100, sampleRate = 16000, autoHideTimeout = 10000, onAudioChunk = () => null } = option
  return (art: Artplayer): AsrResult => {
    const layer = art.layers.add({ name: 'asr', html: '' })
    if (!layer)
      throw new Error('Could not create ASR subtitle layer')
    const subtitles = createSubtitles(layer, length, autoHideTimeout)
    const capture = new Capture(art.video, { interval, sampleRate, onAudioChunk }, subtitles.append)
    const volume = () => capture.volume(art.volume)
    const play = () => capture.start()
    const pause = () => capture.pause()
    const restart = () => capture.restart()
    const stop = () => capture.stop()
    const destroy = () => {
      subtitles.destroy()
      art.off('video:volumechange', volume)
      art.off('play', play)
      art.off('pause', pause)
      art.off('restart', restart)
      art.off('destroy', destroy)
      return capture.stop(true)
    }
    art.on('video:volumechange', volume)
    art.on('play', play)
    art.on('pause', pause)
    art.on('restart', restart)
    art.on('destroy', destroy)
    return { name: 'artplayerPluginAsr', stop, hide: subtitles.hide, append: subtitles.append }
  }
}

// Published 2.0 CJS consumers used require(...).default; 2.1 exported the function.
Object.defineProperty(artplayerPluginAsr, 'default', { value: artplayerPluginAsr })

if (typeof document !== 'undefined' && !document.getElementById('artplayer-plugin-asr')) {
  const styleElement = document.createElement('style')
  styleElement.id = 'artplayer-plugin-asr'
  styleElement.textContent = style
  document.head.appendChild(styleElement)
}
