import type { SubscriptionHost } from '../../component/resources'
import type { ComponentHost } from '../../component/types'
import type ResourceScope from '../../lifecycle/scope'
import type { PlaybackStorage } from './records'
import { appendElement, queryElement } from '../../component/dom'
import { entryScope, subscribeEntry } from '../../component/resources'
import { isClosing } from '../../lifecycle/instance'
import { timeout } from '../../lifecycle/resources'
import { getSourceScope } from '../../source/operation'
import { secondToTime, setStyle, silencePromise } from '../../utils'
import { readTimes } from './records'

interface PromptEvents {
  'ready': []
  'restart': [string]
  'video:timeupdate': [Event]
}

export interface ResumePromptHost extends ComponentHost, SubscriptionHost<PromptEvents> {
  template: { $player: HTMLElement, $poster: HTMLElement }
  constructor: { AUTO_PLAYBACK_MIN: number, AUTO_PLAYBACK_TIMEOUT: number }
  layers: { add: (option: { name: string, html: string }) => HTMLDivElement | undefined }
  icons: { close: string | Element }
  i18n: { get: (key: string) => string }
  storage: PlaybackStorage
  option: { id?: string, url: string }
  get seek(): undefined
  set seek(value: number)
  play: () => unknown
}

export function installResumePrompt(art: ResumePromptHost): () => void {
  const { i18n, icons, storage, constructor, template: { $poster } } = art
  const element = art.layers.add({
    name: 'auto-playback',
    html: `
            <div class="art-auto-playback-close"></div>
            <div class="art-auto-playback-last"></div>
            <div class="art-auto-playback-jump"></div>
        `,
  })
  if (!element || isClosing(art))
    return () => {}
  const $last = queryElement('.art-auto-playback-last', element)
  const $jump = queryElement('.art-auto-playback-jump', element)
  const $close = queryElement('.art-auto-playback-close', element)
  appendElement($close, icons.close)
  const owner = entryScope(element)
  let current: ResourceScope | undefined
  let revision = 0
  const init = () => {
    const generation = ++revision
    current?.dispose()
    if (owner.closed || isClosing(art) || revision !== generation)
      return
    const scope = owner.child()
    current = scope
    const active = () => current === scope && !scope.closed && !isClosing(art)
    scope.add(() => {
      if (current === scope) {
        current = undefined
        setStyle(element, 'display', 'none')
      }
    })
    const releaseSource = getSourceScope(art).add(() => {
      scope.dispose()
    })
    scope.add(() => {
      releaseSource()
    })
    const times = readTimes(storage)
    const currentTime = times[art.option.id || art.option.url]
    if (!active())
      return
    setStyle(element, 'display', 'none')
    if (!active() || !currentTime || !(currentTime >= constructor.AUTO_PLAYBACK_MIN))
      return
    if (!active())
      return
    setStyle(element, 'display', 'flex')
    if (!active())
      return
    const lastText = `${i18n.get('Last Seen')} ${secondToTime(currentTime)}`
    if (!active())
      return
    $last.textContent = lastText
    if (!active())
      return
    const jumpText = i18n.get('Jump Play')
    if (!active())
      return
    $jump.textContent = jumpText
    if (!active())
      return
    const bind = (target: HTMLElement, callback: () => void) => {
      const cleanup = art.events.proxy(target, 'click', () => {
        if (active())
          callback()
      })
      scope.add(() => {
        art.events.remove(cleanup)
      })
    }
    bind($close, () => {
      setStyle(element, 'display', 'none')
    })
    if (!active())
      return
    bind($jump, () => {
      art.seek = currentTime
      if (!active())
        return
      silencePromise(art.play())
      if (!active())
        return
      setStyle($poster, 'display', 'none')
      if (active())
        setStyle(element, 'display', 'none')
    })
    if (!active())
      return
    let releaseUpdate = () => {}
    let fired = false
    const update = () => {
      if (fired || !active())
        return
      fired = true
      releaseUpdate()
      timeout(scope, () => {
        if (active())
          setStyle(element, 'display', 'none')
      }, constructor.AUTO_PLAYBACK_TIMEOUT)
    }
    art.on('video:timeupdate', update)
    releaseUpdate = scope.add(() => {
      art.off('video:timeupdate', update)
    })
    if (fired)
      releaseUpdate()
  }
  return () => {
    subscribeEntry<PromptEvents, 'ready'>(art, element, 'ready', init)
    subscribeEntry<PromptEvents, 'restart'>(art, element, 'restart', init)
  }
}
