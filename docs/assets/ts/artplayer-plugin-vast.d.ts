// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-use-before-define, ts/consistent-type-definitions -- Preserve historical export ordering and private aliases. */
export = artplayerPluginVast
export as namespace artplayerPluginVast;
type Option = (params: {
  art: Artplayer
  id: string
  ima: any
  imaPlayer: any
  $container: HTMLDivElement
  playUrl: (url: string) => void
  playRes: (res: string) => void
}) => void
type Result = {
  name: 'artplayerPluginVast'
}
declare const artplayerPluginVast: (option: Option) => (art: Artplayer) => Result
