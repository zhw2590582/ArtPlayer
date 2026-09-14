import type Artplayer from 'artplayer'
import vast from 'artplayer-plugin-vast'

type OriginalCallback = (params: {
  art: Artplayer
  id: string
  ima: any
  imaPlayer: any
  $container: HTMLDivElement
  playUrl: (url: string) => void
  playRes: (response: string) => void
}) => void
type OriginalResult = { name: 'artplayerPluginVast' }
type OriginalFactory = (option: OriginalCallback) => (art: Artplayer) => OriginalResult
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type FactoryCheck = Assert<Equal<typeof vast, OriginalFactory>>
type ParameterCheck = Assert<Equal<Parameters<typeof vast>, [option: OriginalCallback]>>
type ResultCheck = Assert<Equal<ReturnType<ReturnType<typeof vast>>, OriginalResult>>

const replacement: typeof vast = (_option) => (_art) => ({ name: 'artplayerPluginVast' })
const reverse: OriginalFactory = vast
vast(({ art, id, imaPlayer, $container, playUrl, playRes }) => {
  const identifier: string = id
  const element: HTMLDivElement = $container
  imaPlayer.addEventListener('AdStarted', () => {})
  const url: void = playUrl('/ad.xml')
  const response: void = playRes('<VAST/>')
  void [art, identifier, element, url, response]
})
export type { FactoryCheck, ParameterCheck, ResultCheck }
void [replacement, reverse]
