import type Artplayer from 'artplayer'
// eslint-disable-next-line ts/no-require-imports -- Exercise historical export-assignment consumers.
import plugin = require('artplayer-plugin-multiple-subtitles')

const vtt = plugin
declare const art: Artplayer
const options: Parameters<typeof vtt>[0] = { subtitles: [] }
const result: ReturnType<ReturnType<typeof vtt>> = { name: 'multipleSubtitles' }
const replacement: typeof vtt = (_option: Parameters<typeof vtt>[0]) => (_art: Artplayer) => result
void vtt(options)(art).name
void replacement
