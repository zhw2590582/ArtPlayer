import type { Option as PlayerOption } from 'artplayer'
import type { Chapters, Option, Result } from 'artplayer-plugin-chapter'
import Artplayer from 'artplayer'
import ArtplayerLegacy from 'artplayer/legacy'
import chapter from 'artplayer-plugin-chapter'
import chapterLegacy from 'artplayer-plugin-chapter/legacy'

const chapters: Chapters = [{ start: 0, end: Infinity, title: 'First' }]
const option: Option = { chapters }
const playerOption: PlayerOption = { container: '#player', url: 'video.mp4', plugins: [chapter(option)] }
const art: Artplayer = new ArtplayerLegacy(playerOption)
const legacy: ArtplayerLegacy = new Artplayer(playerOption)
const result: Result = chapter(option)(art)
const oldEntry: Result = chapterLegacy()(legacy)
result.update(option)
oldEntry.update({})

// @ts-expect-error Result name is a stable literal, not an arbitrary string.
const invalidName: Result['name'] = 'chapter'
// @ts-expect-error Required update option remains required through the legacy entry.
oldEntry.update()
// @ts-expect-error Chapters do not accept string endpoints.
const invalid: Chapters = [{ start: 0, end: '8', title: 'Bad' }]
void [invalidName, invalid]
