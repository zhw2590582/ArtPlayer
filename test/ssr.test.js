import Artplayer from '../packages/artplayer/dist/artplayer.js'

console.log(Artplayer.default.html)

const art = new Artplayer.default({
  container: '.artplayer-app',
  url: './assets/sample/video.mp4',
})
