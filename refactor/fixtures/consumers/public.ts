import Artplayer, { type Option, type Setting } from 'artplayer'
import Legacy from 'artplayer/legacy'
import chapter from 'artplayer-plugin-chapter'

const settings: Setting[] = [{ name: 'quality', html: 'Quality', selector: [{ html: 'Auto', default: true }] }]
const option: Option = {
  container: '#player', url: 'video.mp4', useSSR: true, settings,
  plugins: [chapter({ chapters: [{ start: 0, end: 10, title: 'First' }] })],
}
const art = new Artplayer(option, function (value) {
  const self: Artplayer = this
  const player: Artplayer = value
  self.pause()
  player.currentTime = 5
})
const old = new Legacy(option)
const play: Promise<void> = art.play()
const toggle: void = art.toggle()
const html: string = Artplayer.html
const factory = chapter({})
factory(art).update({ chapters: [] })
art.on('custom', (...values: unknown[]) => values.length).off('custom', () => {})
const registration: Promise<Artplayer['plugins']> = art.plugins.add(factory)
void [old, play, toggle, html, registration]

// Keep rejection checks independent of historical declaration mismatches.
// @ts-expect-error url accepts a string
new Artplayer({ container: '#player', url: 42 })
// @ts-expect-error chapter boundaries must be numbers
chapter({ chapters: [{ start: 'zero', end: 1, title: 'Invalid' }] })
