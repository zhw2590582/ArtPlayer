// npm i artplayer-plugin-liquid-glass
// import artplayerPluginLiquidGlass from 'artplayer-plugin-liquid-glass';

let art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  autoSize: true,
  pip: true,
  setting: true,
  fullscreen: true,
  fullscreenWeb: true,
  miniProgressBar: true,
  autoPlayback: true,
  flip: true,
  playbackRate: true,
  aspectRatio: true,
  thumbnails: {
    url: '/assets/sample/thumbnails.png',
    number: 60,
    column: 10,
    scale: 0.85,
  },
  plugins: [
    artplayerPluginLiquidGlass({
      //
    }),
  ],
})
