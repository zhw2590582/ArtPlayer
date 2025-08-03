import type Artplayer from 'artplayer'

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

export default artplayerPluginHlsControl
