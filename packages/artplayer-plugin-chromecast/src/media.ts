import type { CastSdk, CastSession, ChromecastOptions } from './types'

const mimeTypes: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  ogv: 'video/ogg',
  mp3: 'audio/mp3',
  wav: 'audio/wav',
  flv: 'video/x-flv',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  wmv: 'video/x-ms-wmv',
  mpd: 'application/dash+xml',
  m3u8: 'application/x-mpegURL',
}

export function loadMedia(sdk: CastSdk, session: CastSession, option: ChromecastOptions, currentUrl: string): PromiseLike<unknown> {
  const url = option.url || currentUrl
  const extension = url.split('?')[0]!.split('#')[0]!.split('.').pop()!.toLowerCase()
  const info = new sdk.media.MediaInfo(url, option.mimeType || mimeTypes[extension] || 'application/octet-stream')
  return session.loadMedia(new sdk.media.LoadRequest(info))
}
