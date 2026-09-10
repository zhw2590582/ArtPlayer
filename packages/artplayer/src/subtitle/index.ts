import type { Subtitle as SubtitleInput } from '../../types/subtitle'
import type { SubtitleCue, SubtitleHost, SubtitleOption } from './types'
import validator from 'option-validator'
import scheme from '../scheme'
import { setStyle, setStyles, vttToBlob } from '../utils'
import Component from '../utils/component'
import { parseSubtitle } from './parse'
import { renderSubtitle } from './render'
import { beginSubtitleRequest, initSubtitleState, subtitleState } from './state'
import { replaceSubtitleTrack } from './track'

// Retain Component's runtime prototype and method binding without its registry update type.
const SubtitleBase: new (art: SubtitleHost) => Omit<Component<SubtitleHost>, 'update'> = Component

export default class Subtitle extends SubtitleBase {
  declare name: string
  declare option: SubtitleOption | null
  declare destroyEvent: () => unknown

  constructor(art: SubtitleHost) {
    super(art)
    this.name = 'subtitle'
    this.option = null
    this.destroyEvent = () => null
    const state = initSubtitleState(this, art)
    // init reports active failures through notice; construction has no promise consumer.
    void this.init(art.option.subtitle).catch(() => {})
    let lastState = false
    const timeupdate = () => {
      if (state.scope.closed || !this.url)
        return
      const fullscreen = art.template.$video.webkitDisplayingFullscreen
      if (typeof fullscreen === 'boolean' && fullscreen !== lastState) {
        lastState = fullscreen
        this.createTrack(fullscreen ? 'subtitles' : 'metadata', this.url)
      }
    }
    art.on('video:timeupdate', timeupdate)
    state.scope.add(() => {
      art.off('video:timeupdate', timeupdate)
    })
  }

  get url(): string {
    return this.art.template.$track.src
  }

  set url(url: string) {
    void this.switch(url).catch(() => {})
  }

  get textTrack(): TextTrack | undefined {
    return this.art.template.$video?.textTracks?.[0]
  }

  get activeCues(): SubtitleCue[] {
    // ArtPlayer's converted resources are WebVTT; disabled tracks expose null cue lists.
    return Array.from(this.textTrack?.activeCues || []) as SubtitleCue[]
  }

  get cues(): SubtitleCue[] {
    return Array.from(this.textTrack?.cues || []) as SubtitleCue[]
  }

  style(styles: Partial<CSSStyleDeclaration>): HTMLDivElement
  style(key: string, value: string | number): HTMLDivElement
  style(key: string | Partial<CSSStyleDeclaration>, value?: string | number): HTMLDivElement {
    const { $subtitle } = this.art.template
    return typeof key === 'object' ? setStyles($subtitle, key) : setStyle($subtitle, key, value)
  }

  update(): void {
    renderSubtitle(this)
  }

  async switch(url: string, newOption: SubtitleInput = {}): Promise<string | null | undefined> {
    const { i18n, notice, option } = this.art
    const subtitleOption = { ...option.subtitle, ...newOption, url }
    const state = subtitleState(this)
    const revision = state.revision + 1
    const subUrl = await this.init(subtitleOption)
    if (!state.scope.closed && state.revision === revision && newOption.name)
      notice.show = `${i18n.get('Switch Subtitle')}: ${newOption.name}`
    return subUrl
  }

  createTrack(kind: string, url: string): void {
    replaceSubtitleTrack(this, kind, url)
  }

  async init(subtitleOption: SubtitleOption): Promise<string | null | undefined> {
    const state = subtitleState(this)
    const request = beginSubtitleRequest(state)
    const { notice, template: { $subtitle } } = this.art
    return request.run(async () => {
      if (!this.textTrack)
        return null
      validator(subtitleOption, scheme.subtitle)
      if (!subtitleOption.url)
        return undefined
      this.option = subtitleOption
      this.style(subtitleOption.style)
      let generated: string | undefined
      try {
        if (!request.active)
          return undefined
        const response = await fetch(subtitleOption.url, { signal: request.signal })
        if (!request.active)
          return undefined
        if (!response.ok)
          throw new Error(`Failed to load subtitle: ${response.status} ${response.statusText}`)
        const buffer = await response.arrayBuffer()
        if (!request.active)
          return undefined
        const vtt = parseSubtitle(buffer, subtitleOption)
        if (!request.active)
          return undefined
        const subUrl = vtt === undefined ? subtitleOption.url : (generated = vttToBlob(vtt.vtt))
        if (!request.active)
          return undefined
        $subtitle.innerHTML = ''
        const trackRevision = state.trackRevision + 1
        if (this.url !== subUrl)
          this.createTrack('metadata', subUrl)
        if (!request.active || state.trackRevision > trackRevision)
          return undefined
        if (generated) {
          state.ownedURL = generated
          generated = undefined
        }
        return subUrl
      }
      catch (error) {
        if (!request.active)
          return undefined
        $subtitle.innerHTML = ''
        notice.show = error
        throw error
      }
      finally {
        if (generated) {
          // A replacement can commit before an old listener cleanup throws.
          if (!state.scope.closed && this.url === generated)
            state.ownedURL = generated
          else
            URL.revokeObjectURL(generated)
        }
      }
    })
  }
}
