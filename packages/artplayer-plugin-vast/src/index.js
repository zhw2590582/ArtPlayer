import { loadImaSdk, Player, PlayerOptions } from '@glomex/vast-ima-player'

export default function artplayerPluginVast(callback) {
  return async (art) => {
    const { template, constructor } = art
    const { createElement, setStyles } = constructor.utils
    const { $video, $player } = template

    await loadImaSdk()
    const google = window.google
    const ima = google.ima

    const adsRenderingSettings = new ima.AdsRenderingSettings()
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true
    adsRenderingSettings.enablePreloading = true

    const playerOptions = new PlayerOptions()
    let isAdPlaying = false
    let imaPlayer = null
    let $container = null

    function createContainer() {
      const container = createElement('div')
      const id = `art-vast-${Date.now()}`
      container.id = id
      setStyles(container, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        zIndex: '150',
        backgroundColor: 'black',
        display: 'none',
        pointerEvents: 'auto',
      })
      return container
    }

    function initPlayer() {
      if (imaPlayer)
        return imaPlayer

      $container = createContainer()
      $player.appendChild($container)

      imaPlayer = new Player(ima, $video, $container, adsRenderingSettings, playerOptions)

      imaPlayer.addEventListener('AdContentPauseRequested', () => {
        isAdPlaying = true
        $container.style.display = 'block'
      })

      imaPlayer.addEventListener('AdContentResumeRequested', () => {
        isAdPlaying = false
        $container.style.display = 'none'
      })

      imaPlayer.addEventListener('AdStarted', () => {
        isAdPlaying = true
        $container.style.display = 'block'
      })

      imaPlayer.addEventListener('AdError', (event) => {
        console.error('VAST Ad Error:', event.detail)
        isAdPlaying = false
        $container.style.display = 'none'
      })

      return imaPlayer
    }

    function destroyPlayer() {
      if (imaPlayer?.destroy)
        imaPlayer.destroy()
      if ($container?.parentNode)
        $container.parentNode.removeChild($container)
      $container = null
      imaPlayer = null
    }

    function playUrl(url, config = {}) {
      if (isAdPlaying)
        return
      if (!imaPlayer)
        initPlayer()
      const request = new ima.AdsRequest()
      request.adTagUrl = url
      for (const key in config) {
        request[key] = config[key]
      }
      imaPlayer.playAds(request)
    }

    function playRes(res, config = {}) {
      if (isAdPlaying)
        return
      if (!imaPlayer)
        initPlayer()
      const request = new ima.AdsRequest()
      request.adsResponse = res
      for (const key in config) {
        request[key] = config[key]
      }
      imaPlayer.playAds(request)
    }

    if (typeof callback === 'function') {
      await callback({
        art,
        playUrl,
        playRes,
        init: initPlayer,
        ima,
        adsRenderingSettings,
        playerOptions,
        get imaPlayer() {
          return imaPlayer
        },
        get container() {
          return $container
        },
      })
    }

    return {
      name: 'artplayerPluginVast',
      destroy: destroyPlayer,
    }
  }
}

if (typeof window !== 'undefined') {
  window.artplayerPluginVast = artplayerPluginVast
}
