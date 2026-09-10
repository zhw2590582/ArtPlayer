import currentTimeMix from '../../packages/artplayer/src/player/currentTimeMix'
import loadedMix from '../../packages/artplayer/src/player/loadedMix'
import seekMix from '../../packages/artplayer/src/player/seekMix'
import toggleMix from '../../packages/artplayer/src/player/toggleMix'

declare const timing: {
  template: { $video: Pick<HTMLMediaElement, 'currentTime' | 'duration' | 'buffered'> }
  duration: number
  notice: { show: string }
  emit: (name: 'seek', actual: number, requested: number | string) => void
}
currentTimeMix(timing)
timing.currentTime = '12.5 seconds'
const time: number = timing.currentTime
seekMix(timing)
timing.seek = 12
const noSeekGetter: undefined = timing.seek
const noForwardGetter: undefined = timing.forward
loadedMix(timing)
const loaded: number = timing.loadedTime
void [time, loaded, noSeekGetter, noForwardGetter]
// @ts-expect-error Buffered state is computed, not writable.
timing.loaded = 0.5
// @ts-expect-error Time inputs do not advertise booleans.
timing.currentTime = true

declare const playback: { playing: boolean, play: () => Promise<42>, pause: () => 'paused' }
toggleMix(playback)
const result: Promise<42> | 'paused' = playback.toggle()
void result
// @ts-expect-error A toggle preserves either branch, not only the play branch.
const invalid: Promise<42> = playback.toggle()
void invalid
