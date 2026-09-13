import type Artplayer from 'artplayer'
import type { Danmu, Option, Result } from 'artplayer-plugin-danmuku'
import danmuku from 'artplayer-plugin-danmuku'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type Factory = (option: Option) => (art: Artplayer) => Result
type SameArguments = Assert<Equal<Parameters<typeof danmuku>, [option: Option]>>
type SameResult = Assert<Equal<ReturnType<ReturnType<typeof danmuku>>, Result>>
type SameEmit = Assert<Equal<ReturnType<Result['emit']>, Result>>
type SameLoad = Assert<Equal<ReturnType<Result['load']>, Promise<Result>>>
type SamePoints = Assert<Equal<Option['points'], { time: number, value: number }[] | undefined>>
type SameDanmuKeys = Assert<Equal<keyof Danmu, 'text' | 'mode' | 'color' | 'time' | 'border' | 'style'>>

declare const art: Artplayer
declare const result: Result
const replacement: Factory = (_option: Option) => (_art: Artplayer) => result
const toOld: Factory = danmuku
const fromOld: typeof danmuku = replacement
const option: Option = { danmuku: [], points: [{ time: 1, value: 2 }], margin: [0, '25%'], beforeEmit: async () => true }
const plugin: Result = danmuku(option)(art)
const synchronousOldEmit: Result = plugin.emit({ text: 'old declaration', mode: 1 })
const loaded: Promise<Result> = plugin.load(Promise.resolve([{ text: 'reload' }]))
const configured: Result = plugin.config(option)
const mounted: void = plugin.mount('#external')
void [toOld, fromOld, synchronousOldEmit, loaded, configured, mounted]
export type { SameArguments, SameDanmuKeys, SameEmit, SameLoad, SamePoints, SameResult }
