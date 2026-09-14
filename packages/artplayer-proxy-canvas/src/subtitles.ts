export function forwardSubtitleTrack(canvas: HTMLCanvasElement, video: HTMLVideoElement, initialTrack: HTMLTrackElement, active: () => boolean): void {
  if (!active())
    return
  const append = canvas.appendChild
  initialTrack.kind = 'metadata'
  initialTrack.default = true
  video.appendChild(initialTrack)
  canvas.appendChild = <T extends Node>(node: T): T => {
    if (active() && node.nodeType === 1 && node.nodeName === 'TRACK' && 'namespaceURI' in node && node.namespaceURI === 'http://www.w3.org/1999/xhtml') {
      initialTrack.remove()
      return video.appendChild(node)
    }
    return append.call(canvas, node) as T
  }
}
