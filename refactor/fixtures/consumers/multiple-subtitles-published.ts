import Artplayer from 'artplayer'
import subtitles from 'artplayer-plugin-multiple-subtitles'

const option: Parameters<typeof subtitles>[0] = { subtitles: [{ url: '/en.vtt', name: 'en', type: 'vtt', encoding: 'utf-8', onParser: (...args) => args }, {}] }
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [subtitles(option)] })
const result: ReturnType<ReturnType<typeof subtitles>> = { name: 'multipleSubtitles' }
const replacement: typeof subtitles = (_option: Parameters<typeof subtitles>[0]) => (_art: Artplayer) => result
void subtitles(option)(art).name
void replacement
