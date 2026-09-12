/* eslint-disable ts/no-redeclare -- The callable export and public type namespace intentionally merge. */
import type * as Definition from '../artplayer-plugin-ads'

declare const artplayerPluginAds: Definition.RuntimeFactory
declare namespace artplayerPluginAds {
  type Option = Definition.Option
  type Result = Definition.Result
  type RuntimeFactory = Definition.RuntimeFactory
  type Translations = Definition.Translations
}
export = artplayerPluginAds
