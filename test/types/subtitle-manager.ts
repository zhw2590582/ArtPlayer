import type Subtitle from '../../packages/artplayer/src/subtitle'
import type { SubtitleCue, SubtitleHost, SubtitleOption } from '../../packages/artplayer/src/subtitle/types'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Expect<T extends true> = T

declare const subtitle: Subtitle
declare const host: SubtitleHost
declare const options: SubtitleOption

subtitle.init(options)
subtitle.switch('/subtitle.vtt', { onVttLoad: vtt => vtt })
subtitle.style({ color: 'red' })
subtitle.style('fontSize', '22px')
subtitle.url = '/subtitle.srt'
host.emit('subtitleBeforeUpdate', subtitle.activeCues)

type Cues = Expect<Equal<typeof subtitle.cues, SubtitleCue[]>>
type Switch = Expect<Equal<ReturnType<Subtitle['switch']>, Promise<string | null | undefined>>>
type Update = Expect<Equal<ReturnType<Subtitle['update']>, void>>
type Style = Expect<Equal<ReturnType<Subtitle['style']>, HTMLDivElement>>
export type Assertions = [Cues, Switch, Update, Style]

// @ts-expect-error Subtitle update does not accept registry entries.
subtitle.update({ name: 'entry' })
// @ts-expect-error Conversion callbacks produce text synchronously.
subtitle.switch('/subtitle.vtt', { onVttLoad: async vtt => vtt })
