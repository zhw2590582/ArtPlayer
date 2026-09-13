import type Artplayer from 'artplayer'
import type { Option, Result, Thumbnail } from '../../packages/artplayer-plugin-vtt-thumbnail/src/types'
import factory from '../../packages/artplayer-plugin-vtt-thumbnail/src/index'
import createLifetime from '../../packages/artplayer-plugin-vtt-thumbnail/src/lifetime'
import parseVtt, { findThumbnail } from '../../packages/artplayer-plugin-vtt-thumbnail/src/parseVtt'
import requestVtt from '../../packages/artplayer-plugin-vtt-thumbnail/src/request'
import legacyFactory from '../../packages/artplayer-plugin-vtt-thumbnail/types/artplayer-plugin-vtt-thumbnail'

declare const art: Artplayer
const option: Option = { vtt: '/cues.vtt', style: { opacity: '0.8', width: '80px' } }
const registration = factory(option)
const result: Promise<Result> = registration(art)
result.then(value => value.name satisfies 'artplayerPluginVttThumbnail')
// @ts-expect-error Registration is asynchronous, without a synchronous name property.
void result.name
// @ts-expect-error Omitted options remain invalid in typed calls.
factory()
// @ts-expect-error VTT URL is a string.
factory({ vtt: 12 })
// @ts-expect-error CSS width retains the existing CSSStyleDeclaration input type.
factory({ style: { width: 12 } })

const lifetime = createLifetime(art)
lifetime.listen('setBar', (_type, percentage, event) => {
  percentage.toFixed()
  event?.preventDefault()
})
// @ts-expect-error The lifetime only owns the events this plugin actually uses.
lifetime.listen('not-an-event', () => {})
const value: Promise<number | void> = lifetime.wait(Promise.resolve(3))
const text: Promise<string | void> = requestVtt('/cues.vtt', lifetime)
void value
void text
// @ts-expect-error Closed is a read-only state.
lifetime.closed = false

const cues: Thumbnail[] = parseVtt('WEBVTT')
const selected: Thumbnail | undefined = findThumbnail(cues, 1)
selected?.x.toUpperCase()
// @ts-expect-error Rectangle strings preserve historical formatting.
const width: number = cues[0]!.w
void width

const legacyRegistration = legacyFactory(option)
legacyRegistration(art).name satisfies 'artplayerPluginVttThumbnail'
// @ts-expect-error Published declarations are falsely synchronous; do not hide the conflict.
const legacyReplacement: typeof legacyRegistration = registration
void legacyReplacement
