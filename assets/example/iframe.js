// npm i artplayer-tool-iframe
// import ArtplayerToolIframe from 'artplayer-tool-iframe';

const $iframe = document.createElement('iframe')
$iframe.allowFullscreen = true
$iframe.width = '100%'
$iframe.height = '100%'

const $container = document.querySelector('.artplayer-app')
$container.innerHTML = ''
$container.appendChild($iframe)

const iframe = new ArtplayerToolIframe({
  iframe: $iframe,
  url: '/iframe.html',
})

iframe.message(({ type, data }) => {
  switch (type) {
    case 'fullscreenWeb':
      if (data) {
        $iframe.classList.add('fullscreenWeb')
      }
      else {
        $iframe.classList.remove('fullscreenWeb')
      }
      break
    default:
      break
  }
})

iframe.commit(() => {
  const art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
    fullscreenWeb: true,
  })

  art.on('fullscreenWeb', (state) => {
    ArtplayerToolIframe.postMessage({
      type: 'fullscreenWeb',
      data: state,
    })
  })
})
