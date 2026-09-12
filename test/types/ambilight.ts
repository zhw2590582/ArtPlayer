import type { Factory, Option, Result } from 'artplayer-plugin-ambilight'
import Artplayer from 'artplayer'
import ambilight from 'artplayer-plugin-ambilight'
import legacy from 'artplayer-plugin-ambilight/legacy'

const option: Option = { blur: '40px', opacity: 0.6, frequency: 10, duration: 0.2, zIndex: 3 }
const art = new Artplayer({ container: '#player', url: 'video.mp4', plugins: [ambilight(), ambilight(option), legacy({})] })
ambilight(undefined)
ambilight.default(option)
legacy.default()
declare const optional: Option | undefined
ambilight(optional)
const inferred: Parameters<typeof ambilight>[0] = option
const blur: string | undefined = inferred.blur
const factory: Factory = ambilight
const result: Result = factory(option)(art)
const name: 'artplayerPluginAmbilight' = result.name
const calls: void[] = [result.start(), result.stop()]
const registration: (art: Artplayer) => Result = ambilight()
// @ts-expect-error Keep required last overload for existing Parameters extraction.
const missing: Parameters<typeof ambilight>[0] = undefined
// @ts-expect-error Blur is a CSS string, not a number.
ambilight({ blur: 50 })
// @ts-expect-error Opacity remains numeric.
ambilight({ opacity: '0.5' })
// @ts-expect-error Frequency remains numeric.
ambilight({ frequency: '10' })
// @ts-expect-error Duration remains numeric.
ambilight({ duration: false })
// @ts-expect-error The ignored historical zIndex input still has its declared type.
ambilight({ zIndex: '9' })
// @ts-expect-error Null was never accepted by the public types.
ambilight(null)
// @ts-expect-error Unknown options do not silently enter the contract.
ambilight({ speed: 10 })
// @ts-expect-error Methods are synchronous.
const promise: Promise<void> = result.start()
// @ts-expect-error No public plugin destroy method is introduced.
result.destroy()
void [blur, name, calls, registration, missing, promise]
