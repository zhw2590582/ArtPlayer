import type Artplayer from 'artplayer'
import type { PlaybackControls } from 'artplayer'
import type { PlaybackControls as SharedControls } from 'artplayer/types'

declare const art: Artplayer
const controls: PlaybackControls = art
const shared: SharedControls = controls
const toggled: Promise<void> | void = shared.toggle()
if (toggled)
  toggled.catch(() => {})
const played: Promise<void> = controls.play()
const paused: void = controls.pause()
const historical: void = art.toggle()
void [played, paused, historical]
// @ts-expect-error A paused toggle does not return a Promise.
const alwaysAsync: Promise<void> = controls.toggle()
// @ts-expect-error Toggle does not report playback as a boolean.
const boolean: boolean = controls.toggle()
void [alwaysAsync, boolean]
