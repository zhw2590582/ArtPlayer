import type Artplayer from 'artplayer'
import type { JassubInstance, JassubOption } from 'artplayer-plugin-jassub'
import jassub from 'artplayer-plugin-jassub'
import legacy from 'artplayer-plugin-jassub/legacy'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
interface OldResult { name: 'artplayerPluginJassub', instance: JassubInstance }
type OldFactory = (option: JassubOption) => (art: Artplayer) => OldResult
type FactoryCheck = Assert<Equal<typeof jassub, OldFactory>>
type ArgumentCheck = Assert<Equal<Parameters<typeof jassub>, [option: JassubOption]>>
type ReturnCheck = Assert<Equal<ReturnType<ReturnType<typeof jassub>>, OldResult>>
type ResizeCheck = Assert<Equal<Parameters<JassubInstance['resize']>, [force?: boolean, width?: number, height?: number, top?: number, left?: number]>>

declare const art: Artplayer
declare const instance: JassubInstance
const option: JassubOption = { workerUrl: '/worker.js', wasmUrl: '/worker.wasm', modernWasmUrl: '/modern.wasm', futureOption: true }
const replacement: typeof jassub = (_option: JassubOption) => (_art: Artplayer) => ({ name: 'artplayerPluginJassub', instance })
const reverse: OldFactory = jassub
const legacyReplacement: typeof legacy = replacement
const result: OldResult = jassub(option)(art)
legacy(option)(art)
const resize: Promise<void> = result.instance.resize(true, 640, 360, 0, 0)
const video: Promise<void> = result.instance.setVideo(art.video)
const destroy: Promise<void> = result.instance.destroy()
const extension: string = result.instance.futureMethod(option.futureOption)
export type { ArgumentCheck, FactoryCheck, ResizeCheck, ReturnCheck }
export { destroy, extension, legacyReplacement, replacement, resize, reverse, video }
