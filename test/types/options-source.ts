import type { Option, ResolvedOption } from '../../packages/artplayer/src/option/types'
import createDefaults from '../../packages/artplayer/src/option/defaults'
import resolveOption from '../../packages/artplayer/src/option/resolve'

const input: Option = { container: '#player', url: 'video.mp4', subtitle: { encoding: 'utf-8' } }
const resolved: ResolvedOption = resolveOption(input, createDefaults())
resolved.subtitle.onVttLoad(resolved.subtitle.url)
resolved.thumbnails.column.toFixed()
resolved.volume.toFixed()
resolved.plugins.push(function (art) {
  return { name: 'typed', receiverId: this.id, argumentId: art.id }
})
resolved.proxy = undefined
const extended = resolveOption({ container: '#player', url: '', application: { token: 1 } }, createDefaults())
const token: number = extended.application.token
void token
// @ts-expect-error Input remains optional before resolution.
input.subtitle.onVttLoad('text')
// @ts-expect-error Known fields cannot be widened by generic extension inference.
resolveOption({ container: '#player', url: '', volume: 'loud' }, createDefaults())
// @ts-expect-error Resolved nested defaults are required.
resolved.thumbnails.column = undefined
// @ts-expect-error Existing callback return types remain checked.
resolved.subtitle.onVttLoad = () => 42
// @ts-expect-error Application fields retain their own type.
extended.application.token = 'invalid'

// Historical public declaration gaps; CORE-07 must replace these with positive checks.
// @ts-expect-error Runtime accepts an omitted URL, but the current public Option requires it.
const omittedUrl: Option = { container: '#player' }
// @ts-expect-error Runtime accepts numeric control HTML, but the current public type excludes it.
const numericHtml: NonNullable<Option['controls']>[number] = { html: 42, position: 'left' }
void [omittedUrl, numericHtml]
