import Artplayer from 'artplayer'
import vtt from 'artplayer-plugin-vtt-thumbnail'

const option: Parameters<typeof vtt>[0] = { vtt: '/cues.vtt', style: { opacity: '0.8' } }
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [vtt(option)] })
const result: ReturnType<ReturnType<typeof vtt>> = { name: 'artplayerPluginVttThumbnail' }
const replacement: typeof vtt = (_option: Parameters<typeof vtt>[0]) => (_art: Artplayer) => result
void vtt(option)(art).name
void replacement
