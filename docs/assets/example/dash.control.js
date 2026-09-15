// npm i dashjs
// npm i artplayer-plugin-dash-control

// import dashjs from 'dashjs';
// import artplayerPluginDashControl from 'artplayer-plugin-dash-control';

const useDash = dashjs.supportsMediaSource()
let dash

function destroyDash() {
  const previous = dash
  dash = undefined
  if (previous)
    previous.destroy()
}

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://media.axprod.net/TestVectors/v7-Clear/Manifest_1080p.mpd',
  setting: true,
  plugins: useDash
    ? [
        artplayerPluginDashControl({
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
            getName: track => track.lang?.toUpperCase() || String(track.id ?? 'Audio'),
            // I18n
            title: 'Audio',
            auto: 'Auto',
          },
        }),
      ]
    : [],
  customType: {
    mpd: function playMpd(video, url, art) {
      destroyDash()
      if (useDash) {
        dash = dashjs.MediaPlayer().create()
        art.dash = dash
        dash.initialize(video, url, art.option.autoplay)
      }
      else {
        art.notice.show = 'Unsupported playback format: mpd'
      }
    },
  },
})

art.on('destroy', destroyDash)
