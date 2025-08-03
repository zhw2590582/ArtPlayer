import type Artplayer from 'artplayer'

export = artplayerPluginChapter
export as namespace artplayerPluginChapter;

type Chapters = {
  start: number
  end: number
  title: string
}[]

interface Option {
  chapters?: Chapters
}

interface Result {
  name: 'artplayerPluginChapter'
  update: (option: Option) => void
}

declare const artplayerPluginChapter: (option: Option) => (art: Artplayer) => Result
