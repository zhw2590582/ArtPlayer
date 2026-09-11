import type { ResolvedOption } from '../option/types'
import type { AttributeMethods } from './attrMix'
import type { CssVariableMethods } from './cssVarMix'
import { isClosing } from '../lifecycle/instance'
import { clamp, setStyle } from '../utils'

export interface InitialOptionHost extends AttributeMethods, CssVariableMethods {
  option: Pick<ResolvedOption, 'moreVideoAttr' | 'muted' | 'volume' | 'poster' | 'autoplay' | 'playsInline' | 'theme' | 'cssVar' | 'url'>
  storage: { get: (key: string) => unknown }
  template: {
    $video: Pick<HTMLMediaElement, 'volume'> & { 'autoplay'?: boolean, 'playsInline'?: boolean, 'webkit-playsinline'?: boolean }
    $poster: HTMLElement
  }
  muted: boolean
  get url(): string | null
  set url(value: string)
}

export default function optionInit(art: InitialOptionHost): void {
  if (isClosing(art))
    return
  const {
    option,
    storage,
    template: { $video, $poster },
  } = art

  for (const key in option.moreVideoAttr) {
    if (isClosing(art))
      return
    const value = (option.moreVideoAttr as Record<string, unknown>)[key]
    if (isClosing(art))
      return
    art.attr(key, value)
  }

  if (isClosing(art))
    return
  if (option.muted) {
    const value = option.muted
    if (isClosing(art))
      return
    art.muted = value
  }

  if (isClosing(art))
    return
  if (option.volume) {
    const value = clamp(option.volume, 0, 1)
    if (isClosing(art))
      return
    $video.volume = value
  }

  if (isClosing(art))
    return
  const volumeStorage = storage.get('volume')
  if (isClosing(art))
    return
  if (typeof volumeStorage === 'number') {
    $video.volume = clamp(volumeStorage, 0, 1)
  }

  if (isClosing(art))
    return
  if (option.poster) {
    const value = `url(${option.poster})`
    if (isClosing(art))
      return
    setStyle($poster, 'backgroundImage', value)
  }

  if (isClosing(art))
    return
  if (option.autoplay) {
    const value = option.autoplay
    if (isClosing(art))
      return
    $video.autoplay = value
  }

  if (isClosing(art))
    return
  if (option.playsInline) {
    if (isClosing(art))
      return
    $video.playsInline = true
    if (isClosing(art))
      return
    $video['webkit-playsinline'] = true
  }

  if (isClosing(art))
    return
  if (option.theme) {
    const styles = option.cssVar
    const theme = option.theme
    if (isClosing(art))
      return
    styles['--art-theme'] = theme
  }

  for (const key in option.cssVar) {
    if (isClosing(art))
      return
    const value = (option.cssVar as Record<string, unknown>)[key]
    if (isClosing(art))
      return
    art.cssVar(key, value)
  }

  if (isClosing(art))
    return
  const url = option.url
  if (!isClosing(art))
    art.url = url
}
