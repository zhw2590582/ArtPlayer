// npm i artplayer-proxy-mediabunny
// import artplayerProxyMediabunny from 'artplayer-proxy-mediabunny';

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/index.m3u8',
  autoSize: true,
  setting: true,
  loop: true,
  flip: true,
  playbackRate: true,
  fullscreen: true,
  miniProgressBar: true,
  autoPlayback: true,
  autoOrientation: true,
  proxy: artplayerProxyMediabunny({
    m3u8: {
      quality: {
        control: true,
        setting: true,
        getName: level => level.height ? `${level.height}P` : level.name,
        title: 'Quality',
        auto: 'Auto',
      },
      audio: {
        control: true,
        setting: true,
        getName: track => track.name || track.language,
        title: 'Audio',
        auto: 'Auto',
      },
    },
  }),
})
