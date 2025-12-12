import createCanvasProxy from './proxy/canvasProxy.js'

export default function artplayerProxyMediabunny(option = {}) {
  return (art) => {
    return createCanvasProxy(art, option)
  }
}

if (typeof window !== 'undefined') {
  window.artplayerProxyMediabunny = artplayerProxyMediabunny
}
