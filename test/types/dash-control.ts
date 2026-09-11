import type { AudioTrack, Config, Option, QualityLevel, Result } from 'artplayer-plugin-dash-control'
import Artplayer from 'artplayer'
import dashControl from 'artplayer-plugin-dash-control'
import legacy from 'artplayer-plugin-dash-control/legacy'

const option: Option = {
  quality: { control: true, getName: level => `${level.height}p` },
  audio: { setting: true, getName: track => track.lang || String(track.id) },
}
const art = new Artplayer({ container: '#player', url: 'video.mpd', plugins: [dashControl(), dashControl(option), legacy()] })
const result: Result = dashControl(option)(art)
type HistoricalOption = Parameters<typeof dashControl>[0]
const oldQuality: HistoricalOption['quality'] = { getName: (item: object) => String(item) }
dashControl({ quality: oldQuality })
dashControl(undefined)
const done: void = result.update()
const objectConfig: Config = { getName: (item: object) => String(item) }
dashControl({ quality: objectConfig, audio: objectConfig })
const level: QualityLevel = { height: 720, id: 0 }
const track: AudioTrack = { id: 'en', lang: 'en' }
const unknownTrack: AudioTrack = { id: null, index: null, lang: null }

interface CustomLevel { height: number, bandwidth: number }
interface CustomTrack { id: number, lang: string, roles: string[] }
dashControl({ quality: { getName: (value: CustomLevel) => String(value.bandwidth) }, audio: { getName: (value: CustomTrack) => value.roles.join(',') } })
dashControl<CustomLevel, CustomTrack>({ audio: { getName: track => track.lang } })

// @ts-expect-error Update remains synchronous.
const promise: Promise<void> = result.update()
// @ts-expect-error Update has no options parameter.
result.update({})
// @ts-expect-error Plugin name is the original literal.
const invalidName: Result['name'] = 'dash'
// @ts-expect-error DASH formatters receive only one argument.
dashControl({ quality: { getName: (value: QualityLevel, index: number) => String(index) } })
// @ts-expect-error Custom formatters must return a string.
dashControl({ audio: { getName: () => 123 } })
// @ts-expect-error Visibility options stay boolean.
legacy({ quality: { control: 'yes' } })
// @ts-expect-error Null was never a valid options object.
dashControl(null)
// @ts-expect-error Default SDK fields cannot silently become any.
dashControl({ quality: { getName: level => level.unknownProperty } })
void [done, level, track, unknownTrack, promise, invalidName]
