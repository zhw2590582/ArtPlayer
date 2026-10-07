let cachedVideo = null
let cachedUrl = null

function create({ url, width, number }, callback) {
  // Reuse one element per source url instead of growing a new <video> per
  // call (todo O5). A different url gets a fresh element so concurrent
  // players cannot interrupt each other's seek chain.
  if (!cachedVideo || cachedUrl !== url) {
    cachedVideo = document.createElement('video')
    cachedUrl = url
  }
  const video = cachedVideo
  video.crossOrigin = 'anonymous'
  video.onerror = () => {
    console.warn(`[artplayerPluginAutoThumbnail] failed to load ${url}`)
    video.onseeked = null
  }
  video.src = url

  video.onloadedmetadata = () => {
    const duration = video.duration
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const height = Math.floor((width * video.videoHeight) / video.videoWidth)

    canvas.width = width * 10
    canvas.height = height * Math.ceil(number / 10)

    let blobUrl = null

    function seekAndDraw(index) {
      canvas.toBlob((blob) => {
        if (!blob)
          return
        URL.revokeObjectURL(blobUrl)
        blobUrl = URL.createObjectURL(blob)

        callback({
          url: blobUrl,
          height,
        })
      }, 'image/jpeg')

      if (index >= number)
        return
      video.currentTime = (duration * index) / number

      video.onseeked = () => {
        try {
          ctx.drawImage(video, (index % 10) * width, Math.floor(index / 10) * height, width, height)
        }
        catch (error) {
          console.warn('[artplayerPluginAutoThumbnail] draw failed:', error)
          video.onseeked = null
          return
        }
        seekAndDraw(index + 1)
      }
    }

    seekAndDraw(0)
  }
}

export default function artplayerPluginAutoThumbnail(option) {
  return async (art) => {
    art.on('video:loadedmetadata', () => {
      const url = option.url || art.option.url
      const width = option.width || 160
      const number = option.number || 100
      const scale = option.scale || 1
      create({ url, width, number }, (config) => {
        art.thumbnails = {
          ...config,
          column: 10,
          number,
          width,
          scale,
        }
      })
    })

    return {
      name: 'artplayerPluginAutoThumbnail',
    }
  }
}
