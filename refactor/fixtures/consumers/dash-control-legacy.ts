import Artplayer from 'artplayer'
import dashControl from 'artplayer-plugin-dash-control'

type OldOption = Parameters<typeof dashControl>[0]
type OldQuality = NonNullable<OldOption['quality']>
const options: OldOption = { quality: { control: true, getName: (level: object) => String(level) }, audio: { setting: true } }
const quality: OldQuality = { title: 'Quality', auto: 'Auto' }
const formatter: NonNullable<OldQuality['getName']> = value => String(value)
const art = new Artplayer({ container: '#player', url: 'video.mpd', plugins: [dashControl(options)] })
const plugin: { name: 'artplayerPluginDashControl', update: () => void } = dashControl({ quality })(art)
const done: void = plugin.update()
void [formatter, done]
