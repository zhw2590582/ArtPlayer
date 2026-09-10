import { mock } from 'node:test'

export function playbackFactory({ Emitter, playMix, pauseMix, toggleMix, switchMix }) {
  return function createArt(play = () => Promise.resolve(), playing = false) {
    const art = Object.assign(new Emitter(), {
      url: 'old.mp4',
      currentTime: 37,
      aspectRatio: '16:9',
      playbackRate: 1.5,
      notice: { show: '' },
      i18n: { get: key => key },
      option: { hotkey: true, mutex: false },
      constructor: { instances: [] },
      template: {
        $video: {
          paused: !playing,
          play: mock.fn(play),
          pause() { this.paused = true },
        },
      },
    })
    Object.defineProperty(art, 'playing', { get: () => !art.template.$video.paused })
    for (const mix of [playMix, pauseMix, toggleMix, switchMix])
      mix(art)
    return art
  }
}
