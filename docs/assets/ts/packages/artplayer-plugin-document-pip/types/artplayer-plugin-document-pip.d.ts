interface Option {
  width?: number
  height?: number
  placeholder?: string
  fallbackToVideoPiP?: boolean
}

interface Result {
  name: 'artplayerPluginDocumentPip'
  isSupported: boolean
  isActive: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

declare const artplayerPluginDocumentPip: (option: Option) => (art: Artplayer) => Result

export default artplayerPluginDocumentPip

export = packages\artplayerPluginDocumentPip\types\artplayerPluginDocumentPip;
export as namespace packages\artplayerPluginDocumentPip\types\artplayerPluginDocumentPip;