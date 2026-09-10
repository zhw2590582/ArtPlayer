import type { SubtitleView } from './types'
import { escape } from '../utils'
import { subtitleState } from './state'

export function renderSubtitle(subtitle: SubtitleView): void {
  const state = subtitleState(subtitle)
  if (state.scope.closed)
    return
  const revision = state.revision
  const render = ++state.render
  const active = () => !state.scope.closed && state.revision === revision && state.render === render
  const { art } = subtitle
  const { $subtitle } = art.template
  $subtitle.innerHTML = ''
  if (!subtitle.activeCues.length)
    return
  art.emit('subtitleBeforeUpdate', subtitle.activeCues)
  if (!active())
    return
  const html = subtitle.activeCues.map((cue, index) => cue.text
    .split(/\r?\n/)
    .filter(line => line.trim())
    .map(line => `<div class="art-subtitle-line" data-group="${index}">
                                ${art.option.subtitle.escape ? escape(line) : line}
                            </div>`)
    .join('')).join('')
  if (!active())
    return
  $subtitle.innerHTML = html
  art.emit('subtitleAfterUpdate', subtitle.activeCues)
}
