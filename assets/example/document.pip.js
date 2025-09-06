// npm i artplayer-plugin-document-pip
// import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip';

let art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [
    artplayerPluginDocumentPip({
      width: 480,
      height: 270,
      fallbackToVideoPiP: true,
      placeholder: `Playing in Document Picture-in-Picture`,
    }),
  ],
})

art.on('document-pip', (state) => {
  console.log('Document Picture-in-Picture', state)
})
