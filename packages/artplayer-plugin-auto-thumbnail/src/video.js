export default function createVideo(job) {
  const video = document.createElement('video')
  job.own(() => video.remove())
  job.own(() => video.load())
  job.own(() => video.removeAttribute('src'))
  job.own(() => video.pause())
  for (const property of ['onloadedmetadata', 'onloadeddata', 'onseeked', 'onerror'])
    job.own(() => { video[property] = null })
  if (!job.active())
    return video
  video.crossOrigin = 'anonymous'
  video.muted = true
  video.playsInline = true
  video.tabIndex = -1
  video.setAttribute('aria-hidden', 'true')
  // WebKit needs a rendered box; display:none and a 1px box lose decoded pixels.
  video.style.cssText = 'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;display:block;width:auto;height:auto;max-width:none;max-height:none'
  document.documentElement.appendChild(video)
  if (!job.active())
    video.remove()
  return video
}
