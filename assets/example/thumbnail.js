// npm i artplayer-plugin-thumbnail
// import artplayerPluginThumbnail from 'artplayer-plugin-thumbnail';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [
    artplayerPluginThumbnail({
      width: 160,
      number: 100,
      scale: 1,
    }),
  ],
})
