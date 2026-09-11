import type { Option, Result, RuntimeFactory, RuntimeResult, UpdateOption } from 'artplayer-plugin-audio-track'
import Artplayer from 'artplayer'
import audioTrack from 'artplayer-plugin-audio-track'
import legacy from 'artplayer-plugin-audio-track/legacy'
import runtime from 'artplayer-plugin-audio-track/runtime'

const option: Option = { url: 'audio.aac', offset: 0, sync: 0.3 }
const art = new Artplayer({ container: '#player', url: 'video.mp4', plugins: [audioTrack(option), legacy(option)] })
const plugin: RuntimeResult = runtime(option)(art)
const precise: RuntimeFactory = runtime
const rootResult: Result = audioTrack(option)(art)
rootResult.update(option)
const element: HTMLAudioElement = plugin.audio
const update: UpdateOption = { offset: -0.5, sync: undefined }
const done: void = plugin.update(update)
plugin.update({})
plugin.update({ url: 'next.aac' })
plugin.update({ offset: undefined })
const historicalOption: Parameters<typeof audioTrack>[0] = option
const historicalUpdate: Parameters<Result['update']>[0] = option
const historicalURL: string = historicalUpdate.url
type HistoricalResult = ReturnType<ReturnType<typeof audioTrack>>
const implemented: HistoricalResult = {
  name: 'artplayerPluginAudioTrack',
  audio: element,
  update: (options: Option) => { element.src = options.url },
}
const contextual: HistoricalResult = {
  name: 'artplayerPluginAudioTrack',
  audio: element,
  update(options) {
    element.src = options.url
  },
}
const unbound = plugin.update
unbound({ sync: 0 })
const legacyPlugin: Result = legacy(option)(art)

// @ts-expect-error The factory still requires its options object.
audioTrack()
// @ts-expect-error A factory configuration still requires a URL.
audioTrack({})
// @ts-expect-error URLs are strings.
audioTrack({ url: 123 })
// @ts-expect-error update still requires an object argument.
plugin.update()
// @ts-expect-error Threshold values are numbers.
plugin.update({ sync: 'fast' })
// @ts-expect-error Null URLs are not part of the old public contract.
plugin.update({ url: null })
// @ts-expect-error The exposed media remains a real audio element.
plugin.audio = 123
// @ts-expect-error update stays synchronous.
const promise: Promise<void> = plugin.update({ offset: 1 })
// @ts-expect-error Plugin name stays a literal.
const name: Result['name'] = 'audio'
// @ts-expect-error Historical extracted factory URL stays required.
const missingURL: Parameters<typeof audioTrack>[0]['url'] = undefined
// @ts-expect-error Unknown option fields do not gain an index signature.
plugin.update({ unknown: true })
// @ts-expect-error Legacy import retains the same strict configuration.
legacy({ url: 'audio.aac', offset: 'later' })
void [done, historicalOption, historicalURL, implemented, contextual, legacyPlugin, promise, name, missingURL, precise]
