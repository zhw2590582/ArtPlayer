import type { Option } from 'artplayer'
import Artplayer from 'artplayer'
import chapter from 'artplayer-plugin-chapter'

const options: Option = {
  container: '#player',
  url: 'video.mp4',
  plugins: [chapter({ chapters: [{ start: 0, end: 5, title: 'First' }] })],
}
const art = new Artplayer(options, function (player) {
  // eslint-disable-next-line ts/no-this-alias -- Assert the public ready callback receiver type.
  const self: Artplayer = this
  self.pause()
  player.seek = 1
})
const playback: Promise<void> = art.play()
const html: string = Artplayer.html
const plugin = chapter({})(art)
plugin.update({ chapters: [] })
art.on('custom', (value: unknown) => value)
void [playback, html]

// @ts-expect-error A media URL is a string.
const invalid = new Artplayer({ container: '#player', url: 42 })
void invalid
// @ts-expect-error Chapter start times are numeric.
chapter({ chapters: [{ start: '0', end: 5, title: 'Invalid' }] })
