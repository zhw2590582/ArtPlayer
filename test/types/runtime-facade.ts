import type SourceArtplayer from '../../packages/artplayer/src'
import type { I18nHost } from '../../packages/artplayer/src/i18n'
import type RuntimeArtplayer from '../../packages/artplayer/types/runtime'
import type { ArtplayerConstructor } from '../../packages/artplayer/types/runtime'
import type { Config, EventRegistry, Hotkey, I18n, Storage } from '../../packages/artplayer/types/runtime/services'

declare const source: SourceArtplayer
declare const constructor: typeof SourceArtplayer
const events: EventRegistry = source.events
const storage: Storage = source.storage
const hotkey: Hotkey<SourceArtplayer> = source.hotkey
const language: I18n<I18nHost> = source.i18n
const config: Config = constructor.config
const validator: ArtplayerConstructor['validator'] = constructor.validator
const kindOf: ArtplayerConstructor['kindOf'] = constructor.kindOf
const scheme: ArtplayerConstructor['scheme'] = constructor.scheme

// The facade covers every implementation member without whole-instance assertions.
const missingInstance: Exclude<keyof SourceArtplayer, keyof RuntimeArtplayer> extends never ? true : false = true
const extraInstance: Exclude<keyof RuntimeArtplayer, keyof SourceArtplayer | 'flv' | 'm3u8' | 'hls' | 'ts' | 'mpd' | 'torrent'> extends never ? true : false = true
const missingStatic: Exclude<keyof typeof SourceArtplayer, keyof ArtplayerConstructor> extends never ? true : false = true
const extraStatic: Exclude<keyof ArtplayerConstructor, keyof typeof SourceArtplayer> extends never ? true : false = true

type ValueMembers = 'id' | 'isLock' | 'isReady' | 'isFocus' | 'isInput' | 'isRotate' | 'isDestroy' | 'video' | 'player' | 'reset' | 'destroy'
const values: Pick<RuntimeArtplayer, ValueMembers> = source
type SharedOptions = Exclude<keyof RuntimeArtplayer['option'], 'proxy' | 'plugins' | 'customType' | 'layers' | 'controls' | 'contextmenu' | 'settings'>
const options: Pick<RuntimeArtplayer['option'], SharedOptions> = source.option
const storageValue: unknown = storage.get()
// @ts-expect-error Persisted JSON can be a primitive, not just a settings object.
const falseSettings: Record<string, unknown> = storage.get()
void [events, storage, hotkey, language, config, validator, kindOf, scheme, missingInstance, extraInstance, missingStatic, extraStatic, values, options, storageValue, falseSettings]
