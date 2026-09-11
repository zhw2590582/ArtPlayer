import type { AudioTrack, Config, Option, QualityLevel, Result } from 'artplayer-plugin-hls-control'
import Artplayer from 'artplayer'
import hlsControl from 'artplayer-plugin-hls-control'
import legacy from 'artplayer-plugin-hls-control/legacy'

const option: Option = {
  quality: { control: true, getName: (level, index) => `${level.height}P ${index ?? ''}` },
  audio: { setting: true, getName: track => track.name },
}
const art = new Artplayer({ container: '#player', url: 'video.m3u8', plugins: [hlsControl(), hlsControl(option), legacy()] })
const result: Result = hlsControl(option)(art)
type HistoricalOption = Parameters<typeof hlsControl>[0]
const historicalQuality: HistoricalOption['quality'] = { getName: (item: object) => String(item) }
hlsControl({ quality: historicalQuality })
hlsControl(undefined)
const done: void = result.update()
const generic: Config = { getName: (item: object) => String(item) }
hlsControl({ quality: generic, audio: generic })
const level: QualityLevel = { height: 720 }
const track: AudioTrack = { id: 0, name: 'English' }

interface CustomLevel { height: number, bitrate: number, label: string }
interface CustomTrack { id: number, name: string, groupId: string }
hlsControl({ quality: { getName: (value: CustomLevel) => value.label }, audio: { getName: (value: CustomTrack) => value.groupId } })
hlsControl<CustomLevel, CustomTrack>({ quality: { getName: value => String(value.bitrate) } })

// @ts-expect-error update stays synchronous and returns void.
const promise: Promise<void> = result.update()
// @ts-expect-error update takes no configuration argument.
result.update({})
// @ts-expect-error The result name remains a literal.
const invalidName: Result['name'] = 'hls'
// @ts-expect-error Selected-label calls do not supply the index.
hlsControl({ quality: { getName: (value: QualityLevel, index: number) => String(index) } })
// @ts-expect-error A formatter must return a string.
hlsControl({ audio: { getName: () => 123 } })
// @ts-expect-error Control visibility is boolean.
legacy({ quality: { control: 'yes' } })
// @ts-expect-error Null was never a valid options object.
hlsControl(null)
// @ts-expect-error Default quality fields are typed, not an any escape.
hlsControl({ quality: { getName: value => value.unknownProperty } })
void [done, level, track, promise, invalidName]
