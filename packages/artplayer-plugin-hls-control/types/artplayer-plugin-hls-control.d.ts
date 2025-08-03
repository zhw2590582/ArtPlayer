import type Artplayer from 'artplayer'

export = artplayerPluginHlsControl
export as namespace artplayerPluginHlsControl;

interface Config {
  control?: boolean
  setting?: boolean
  title?: string
  auto?: string
  getName?: (level: object) => string
}

declare const artplayerPluginHlsControl: (option: { quality?: Config, audio?: Config }) => (art: Artplayer) => {
  name: 'artplayerPluginHlsControl'
  update: () => void
}
