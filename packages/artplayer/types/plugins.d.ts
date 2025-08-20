/**
 * Media format plugin types for different video formats
 */
export interface MediaFormatPlugins {
  /** FLV format plugin instance */
  flv?: any
  /** M3U8/HLS format plugin instance */
  m3u8?: any
  /** HLS format plugin instance */
  hls?: any
  /** TS format plugin instance */
  ts?: any
  /** DASH/MPD format plugin instance */
  mpd?: any
  /** Torrent format plugin instance */
  torrent?: any
}

/**
 * Hotkey configuration interface
 */
export interface HotkeyConfig {
  /** Registered hotkey mappings */
  keys: Record<string, Array<(event: Event) => any>>
  /** Add a new hotkey */
  add: (key: string, callback: (this: Artplayer, event: Event) => any) => HotkeyConfig
  /** Remove a hotkey */
  remove: (key: string, callback: (event: Event) => any) => HotkeyConfig
}

/**
 * Plugin management interface
 */
export interface PluginManager {
  /** Add a new plugin */
  add: (
    plugin: (this: Artplayer, art: Artplayer) => unknown | Promise<unknown>,
  ) => Promise<PluginManager> | PluginManager
  /** Dynamic plugin instances */
  [pluginName: string]: unknown
}
