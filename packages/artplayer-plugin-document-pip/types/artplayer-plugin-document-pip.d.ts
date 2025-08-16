import type Artplayer from 'artplayer'

interface Option {
  width?: number
  height?: number
  placeholder?: string
  fallbackToVideoPiP?: boolean
}

interface Result {
  name: 'artplayerPluginDocumentPip'
  open: () => void
  close: () => void
  toggle: () => void
  state: {
    win: Window | null
    originalParent: Element | null
    originalNext: Element | null
    currentDoc: Document | null
    placeholder: Element | null
  }
}

declare const artplayerPluginDocumentPip: (option: Option) => (art: Artplayer) => Result

export default artplayerPluginDocumentPip
