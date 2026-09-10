import type { TemplateHost } from '../../packages/artplayer/src/template/types'
import I18n from '../../packages/artplayer/src/i18n'
import Template from '../../packages/artplayer/src/template'

interface Host extends TemplateHost<Host> {
  custom: string
}
declare const host: Host
host.option.proxy = function (art) {
  const same = this satisfies Host
  const label: string = art.custom + same.custom
  return document.createElement(label ? 'canvas' : 'video')
}
const template = new Template(host)
const node: HTMLVideoElement | HTMLCanvasElement | null = template.$video
const track: HTMLTrackElement | null = template.query<HTMLTrackElement>('track')
// @ts-expect-error A bare canvas is not a complete native video.
const video: HTMLVideoElement = template.$video
const i18n = new I18n({ option: { lang: 'custom', i18n: { custom: { Feature: 'feature' } } } })
const message: string = i18n.get('Feature')
// @ts-expect-error A message dictionary is not a numeric table.
i18n.update({ custom: { Feature: 42 } })
void [node, track, video, message]
