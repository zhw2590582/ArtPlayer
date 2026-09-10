import Artplayer = require('artplayer')
import chapter = require('artplayer-plugin-chapter')
import legacy = require('artplayer-plugin-chapter/legacy')
import french = require('artplayer/i18n/fr')

const option: Artplayer.Option = { container: '#player', url: 'video.mp4', i18n: { fr: french } }
const art: Artplayer = new Artplayer(option)
const result: chapter.Result = chapter()(art)
const old: legacy.Result = legacy()(art)
result.update({})
old.update({})
// @ts-expect-error CommonJS callers retain strict endpoint types.
chapter({ chapters: [{ start: '0', end: 8, title: 'Invalid' }] })
