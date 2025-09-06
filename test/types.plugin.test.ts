import Artplayer from 'artplayer'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'

const art = new Artplayer({
  container: '.artplayer-app',
  url: './assets/sample/video.mp4',
  plugins: [
    artplayerPluginDanmuku({
      danmuku: '',
      margin: [0, '10%'],
    }),
  ],
})

art.plugins.add(
  artplayerPluginDanmuku({
    danmuku: '',
    margin: [0, '10%'],
  }),
)

art.on('artplayerPluginDanmuku:load', () => {
  //
})
