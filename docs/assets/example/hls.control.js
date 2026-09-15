// npm i hls.js
// npm i artplayer-plugin-hls-control

// import Hls from 'hls.js';
// import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';

const useHls = Hls.isSupported()
let hls

function destroyHls() {
  const previous = hls
  hls = undefined
  if (previous)
    previous.destroy()
}

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/index.m3u8',
  setting: true,
  plugins: useHls
    ? [
        artplayerPluginHlsControl({
          quality: {
            // Show quality choices in the controls
            control: true,
            // Show quality choices in settings
            setting: true,
            // Get the quality name from level
            getName: level => `${level.height}P`,
            // I18n
            title: 'Quality',
            auto: 'Auto',
          },
          audio: {
            // Show audios in control
            control: true,
            // Show audios in setting
            setting: true,
            // Get the audio name from track
            getName: track => track.name || track.lang || 'Audio',
            // I18n
            title: 'Audio',
            auto: 'Auto',
          },
        }),
      ]
    : [],
  customType: {
    m3u8: function playM3u8(video, url, art) {
      destroyHls()
      if (useHls) {
        hls = new Hls()
        art.hls = hls
        hls.loadSource(url)
        hls.attachMedia(video)
      }
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
      }
      else {
        art.notice.show = 'Unsupported playback format: m3u8'
      }
    },
  },
})

art.on('destroy', destroyHls)
