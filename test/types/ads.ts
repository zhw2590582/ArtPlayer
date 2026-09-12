import type { CompatOption, Factory, LegacyOption, Option, Result, WorkspaceOption } from 'artplayer-plugin-ads'
import Artplayer from 'artplayer'
import ads from 'artplayer-plugin-ads'
import legacy from 'artplayer-plugin-ads/legacy'
import precise from 'artplayer-plugin-ads/runtime'

const option: Option = { video: 'ad.mp4', html: '<b>ad</b>', url: '/details', totalDuration: 10, muted: true, i18n: { close: 'Close', countdown: '%s seconds', detail: 'Details', canBeClosed: 'Wait %s seconds' } }
const oldPublished: LegacyOption = { html: 'ad', totalDuration: '10' }
const oldWorkspace: WorkspaceOption = { source: 'ad.mp4', type: 'video', totalDuration: 10 }
const art = new Artplayer({ container: '#player', url: 'video.mp4', plugins: [ads(), ads(option), legacy(option), precise(option)] })
ads(oldPublished)
ads(oldWorkspace)
ads.default(option)
legacy.default(option)
precise.default(option)
ads(undefined)
precise(undefined)
const result: Result = ads(option)(art)
const methods: void[] = [result.skip(), result.play(), result.pause()]
const factory: Factory = ads
const input: CompatOption = oldWorkspace
const inferredOld: Parameters<typeof ads>[0] = oldPublished
const inferredWorkspace: Parameters<typeof ads>[0] = oldWorkspace
const raw: Parameters<typeof precise>[0] = option
const numericDuration: number | undefined = option.totalDuration
function readCompatibleDuration(value: CompatOption): number | undefined {
  if (value.totalDuration !== undefined && typeof value.totalDuration !== 'number')
    throw new TypeError('Ads requires numeric duration')
  return value.totalDuration
}

// @ts-expect-error The precise entry rejects the historical duration typo.
precise({ totalDuration: '10' })
// @ts-expect-error source/type are not implemented runtime aliases.
precise({ source: 'ad.mp4', type: 'video' })
// @ts-expect-error Durations are not boolean in either declaration family.
ads({ totalDuration: false })
// @ts-expect-error No declaration accepted a string skip threshold.
ads({ playDuration: '1' })
// @ts-expect-error HTML is text, not a DOM node.
ads({ html: document.body })
// @ts-expect-error Translation objects replace all four fields together.
ads({ i18n: { close: 'Close' } })
// @ts-expect-error The plugin methods are synchronous.
const promise: Promise<void> = result.skip()
// @ts-expect-error Plugin name retains its literal spelling.
const name: Result['name'] = 'ads'
// @ts-expect-error Historical workspace type remains a fixed union.
ads({ source: 'ad', type: 'audio' })
// @ts-expect-error Historical string durations cannot become accurate numeric options.
const wrong: Option = oldPublished
void [methods, factory, input, inferredOld, inferredWorkspace, raw, numericDuration, readCompatibleDuration, promise, name, wrong]
