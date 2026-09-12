import Artplayer from 'artplayer'
import ambilight from 'artplayer-plugin-ambilight'

const option = { blur: '50px', opacity: 0.5, frequency: 10, zIndex: 9, duration: 0.3 }
const art = new Artplayer({ container: '#player', url: 'video.mp4', plugins: [ambilight(option)] })
const result = ambilight(option)(art)
const name: 'artplayerPluginAmbilight' = result.name
const calls: void[] = [result.start(), result.stop()]
const accepted: Parameters<typeof ambilight>[0] = option
void [name, calls, accepted]
