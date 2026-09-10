// npm i artplayer-plugin-auto-thumbnail
// import artplayerPluginAutoThumbnail from 'artplayer-plugin-auto-thumbnail';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [
    artplayerPluginAutoThumbnail({
      //
    }),
  ],
})
