import type Artplayer from 'artplayer'

export = artplayerPluginDashControl
export as namespace artplayerPluginDashControl;

interface Config {
  control?: boolean
  setting?: boolean
  title?: string
  auto?: string
  getName?: (level: object) => string
}

declare const artplayerPluginDashControl: (option: { quality?: Config, audio?: Config }) => (art: Artplayer) => {
  name: 'artplayerPluginDashControl'
  update: () => void
}
