import type { AsyncResult, Factory, Option, Result, RuntimeFactory } from 'artplayer-plugin-document-pip'
import Artplayer from 'artplayer'
import dpip from 'artplayer-plugin-document-pip'
import legacy from 'artplayer-plugin-document-pip/legacy'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type ExactParameters = Assert<Equal<Parameters<typeof dpip>, [option: Option]>>
type ExactResult = Assert<Equal<ReturnType<ReturnType<typeof dpip>>, Result>>
type ExactOpen = Assert<Equal<ReturnType<Result['open']>, void>>
type ExactDirectOpen = Assert<Equal<ReturnType<typeof result.open>, void>>
type ExactFactory = Assert<Equal<typeof dpip, (option: Option) => (art: Artplayer) => Result>>

const options: Option = { width: 640, height: 360, placeholder: 'Active', fallbackToVideoPiP: false }
const art = new Artplayer({ container: '#player', url: 'video.mp4', plugins: [dpip(options)] })
const runtimeFactory = dpip as RuntimeFactory
runtimeFactory()
runtimeFactory(undefined)
runtimeFactory.default(options)
legacy(options)
declare const optional: Option | undefined
runtimeFactory(optional)
const factory: Factory = dpip
const result = factory(options)(art)
result.open = () => {}
result.close = () => {}
const mutable: Result = { name: 'artplayerPluginDocumentPip', isSupported: true, isActive: false, open() {}, close() {}, toggle() {} }
mutable.isActive = true
mutable.isSupported = false
const oldFactoryReplacement: typeof dpip = (_options: Option) => (_art: Artplayer) => mutable
const returned: void = result.open()
const asyncResult: AsyncResult = runtimeFactory()(art)
const opening: Promise<void> = asyncResult.open()
const closing: Promise<void> = asyncResult.close()
const toggled: void = asyncResult.toggle()
const snapshot: boolean = asyncResult.isSupported
const historical: Result = asyncResult
// @ts-expect-error Parameters extraction keeps the historical required option.
const missing: Parameters<typeof dpip>[0] = undefined
// @ts-expect-error Width is numeric.
dpip({ width: '640' })
// @ts-expect-error Height is numeric.
dpip({ height: '360' })
// @ts-expect-error Placeholder is text.
dpip({ placeholder: 1 })
// @ts-expect-error Fallback is boolean.
dpip({ fallbackToVideoPiP: 'yes' })
// @ts-expect-error Null was never a typed option.
dpip(null)
// @ts-expect-error Unknown options remain errors.
dpip({ arbitrary: true })
// @ts-expect-error Registration requires its Artplayer host.
dpip({})()
// @ts-expect-error Plugin registration remains synchronous.
const asyncRegistration: Promise<Result> = dpip({})(art)
// @ts-expect-error The opt-in runtime state is readonly.
asyncResult.isActive = true
// @ts-expect-error The opt-in capability snapshot is readonly.
asyncResult.isSupported = true
// @ts-expect-error Exact async actions cannot be replaced with void actions in this view.
asyncResult.open = () => {}
// @ts-expect-error Legacy void defaults do not falsely promise an awaitable return.
const wrongPromise: Promise<void> = result.open()
// @ts-expect-error Self default identity is readonly in declarations.
runtimeFactory.default = runtimeFactory
void [oldFactoryReplacement, returned, opening, closing, toggled, snapshot, historical, missing, asyncRegistration, wrongPromise]
export type { ExactDirectOpen, ExactFactory, ExactOpen, ExactParameters, ExactResult }
