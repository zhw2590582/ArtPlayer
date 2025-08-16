// npm i artplayer-plugin-pip
// import artplayerPluginPip from 'artplayer-plugin-pip';

let art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [
    artplayerPluginPip({
      width: 480,
      height: 270,
      placeholder: `Playing in Document Picture-in-Picture`,
    }),
  ],
})

art.on('document-pip', (state) => {
  console.log('Document Picture-in-Picture', state)
})
