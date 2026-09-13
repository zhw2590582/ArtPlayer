import type Artplayer from 'artplayer'
import type { Factory, Option, Result } from 'artplayer-plugin-auto-thumbnail/runtime'
import runtime from 'artplayer-plugin-auto-thumbnail/runtime'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type ExactFactory = Assert<Equal<typeof runtime, Factory>>
type ExactOption = Assert<Equal<Parameters<typeof runtime>, [option: Option]>>
type ExactResult = Assert<Equal<ReturnType<ReturnType<typeof runtime>>, Promise<Result>>>

declare const art: Artplayer
const option: Option = { url: '/video.mp4', width: 80, number: 12, scale: 0.5, height: 90 }
const pending: Promise<Result> = runtime(option)(art)
const name: Promise<'artplayerPluginAutoThumbnail'> = pending.then(value => value.name)
const plugins: NonNullable<Artplayer['option']['plugins']> = [runtime(option)]
const replacement: Factory = _option => async _art => ({ name: 'artplayerPluginAutoThumbnail' })
void [name, plugins, replacement]
export type { ExactFactory, ExactOption, ExactResult }
