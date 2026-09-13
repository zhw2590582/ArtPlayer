// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginChapterDefinitions {
  export type Chapters = {
    start: number
    end: number
    title: string
  }[]
  export interface Option {
    chapters?: Chapters
  }
  export interface Result {
    name: 'artplayerPluginChapter'
    update: (option: Option) => void
  }
  export const artplayerPluginChapter: (option?: Option) => (art: Artplayer) => Result
}
declare const artplayerPluginChapter: typeof artplayerPluginChapterDefinitions.artplayerPluginChapter
declare namespace artplayerPluginChapter {
  export type Chapters = artplayerPluginChapterDefinitions.Chapters
  export type Option = artplayerPluginChapterDefinitions.Option
  export type Result = artplayerPluginChapterDefinitions.Result
}
export = artplayerPluginChapter
export as namespace artplayerPluginChapter;
