import type { Emitter } from '../../packages/artplayer/public/emitter'
import type { Events } from '../../packages/artplayer/public/runtime/events'
import type { Notice, Subtitle, SubtitleCue } from '../../packages/artplayer/public/runtime/subtitle'
import type Artplayer from '../../packages/artplayer/src'

declare const source: Artplayer
const events: Emitter<Events> = source
const subtitle: Subtitle = source.subtitle
const notice: Notice = source.notice
const visible: boolean = notice.show
notice.show = 'message'
const switched: Promise<string | null | undefined> = subtitle.switch('/subtitle.vtt')
const styled: HTMLDivElement = subtitle.style('font-size', 20)
events.on('subtitleBeforeUpdate', (cues) => {
  const actual: SubtitleCue[] = cues
  return actual.map(cue => cue.text)
})
events.on('blur', event => event.type)
source.on('subtitleBeforeUpdate', cues => cues.map(cue => cue.text))
events.emit('subtitleAfterUpdate', [])
events.emit('seek', 1.5, '1.5')
// @ts-expect-error The corrected payload cannot retain historical scalar cue inference.
events.on('subtitleBeforeUpdate', (cue: VTTCue) => cue.text)
// @ts-expect-error Native focus loss carries its original Event.
events.emit('blur')
// @ts-expect-error The actual source map must also reject a scalar update payload.
source.emit('subtitleAfterUpdate', 1)
// @ts-expect-error A visibility getter does not return the last message.
const message: string = notice.show
export { events, message, styled, switched, visible }
