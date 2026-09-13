import type { ReactNode } from 'react'
import Artplayer from 'artplayer'
import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Player from './src/Player'

const records: { art: Artplayer, destroyed: number }[] = []
const errors: { message: string, same: boolean }[] = []
const container = document.getElementById('root')
if (!container)
  throw new Error('Missing React fixture container')
const root = createRoot(container)
const option = { url: '/pattern.mp4', muted: true }
const changedOption = { ...option, volume: 0.2 }
const failure = new Error('react-consumer-callback-failure')
function capture(art: Artplayer) {
  const record = { art, destroyed: 0 }
  records.push(record)
  art.on('destroy', () => record.destroyed++)
}
function changedCapture(art: Artplayer) {
  capture(art)
}
function fail(art: Artplayer) {
  capture(art)
  throw failure
}
function failWithCleanupError(art: Artplayer) {
  const destroy = art.destroy.bind(art)
  art.destroy = (...args) => {
    destroy(...args)
    throw new Error('secondary-cleanup-error')
  }
  fail(art)
}
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error) { errors.push({ message: error.message, same: error === failure }) }
  render() { return this.state.failed ? <div id="caught">caught</div> : this.props.children }
}
function render(mode = 'normal') {
  root.render(
    <StrictMode>
      <Boundary key={mode.startsWith('throw') ? mode : 'healthy'}>
        {mode !== 'empty' && (
          <Player
            key="primary"
            id="player"
            className="consumer-container"
            data-consumer="preserved"
            style={{ width: 640, height: 360 }}
            option={mode === 'option' ? changedOption : option}
            getInstance={mode === 'throw-cleanup' ? failWithCleanupError : mode === 'throw' ? fail : mode === 'callback' ? changedCapture : mode === 'optional' ? undefined : capture}
          />
        )}
        {mode === 'siblings' && <Player key="sibling" id="sibling" style={{ width: 320, height: 180 }} option={option} getInstance={capture} />}
      </Boundary>
    </StrictMode>,
  )
}
const probe = {
  render,
  snapshot: () => ({
    active: Artplayer.instances.length,
    created: records.length,
    records: records.map(({ art, destroyed }) => ({ id: art.id, isDestroy: art.isDestroy, destroyed })),
    plugins: Artplayer.instances.map(art => Object.keys(art.plugins)),
    errors,
    videos: document.querySelectorAll('video').length,
    players: document.querySelectorAll('.art-video-player').length,
  }),
  current: () => Artplayer.instances[0],
}
declare global {
  interface Window { probe: typeof probe }
}
window.probe = probe
render()
