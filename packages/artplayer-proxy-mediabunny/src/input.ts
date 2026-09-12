import type { InputOptions } from 'mediabunny'
import {
  ALL_FORMATS,
  BlobSource,
  HLS_FORMATS,
  Input,
  ReadableStreamSource,
  UrlSource,
} from 'mediabunny'

const M3U8_RE = /\.m3u8(?:$|[?#])/i

export function isHlsSource(src: unknown): boolean {
  return typeof src === 'string' && M3U8_RE.test(src)
}

export function normalizeSource(src: unknown): unknown {
  if (typeof src === 'string')
    return new UrlSource(src)
  if (src instanceof Blob)
    return new BlobSource(src)
  if (typeof ReadableStream !== 'undefined' && src instanceof ReadableStream)
    return new ReadableStreamSource(src)
  return src ?? null
}

export function createInput(src: unknown): Input | null {
  const source = normalizeSource(src)
  if (!source)
    return null

  return new Input({
    // Preserve SDK Source/SourceRef pass-through and its historical validation errors.
    source: source as InputOptions['source'],
    formats: isHlsSource(src) ? HLS_FORMATS : ALL_FORMATS,
  })
}
