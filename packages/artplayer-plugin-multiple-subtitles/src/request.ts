import type { Converters, Lifetime, TrackOption } from './types'

export default async function loadVtt(option: TrackOption, { getExt, srtToVtt, assToVtt }: Converters, lifetime: Lifetime): Promise<string | void> {
  if (lifetime.closed)
    return
  const controller = typeof AbortController === 'function' ? new AbortController() : null
  const release = lifetime.own(() => controller?.abort())
  try {
    const url = option.url
    if (lifetime.closed)
      return
    // Keep native fetch coercion for historically optional URLs; do not add a default URL.
    const response = await lifetime.wait(controller ? fetch(url!, { signal: controller.signal }) : fetch(url!))
    if (lifetime.closed)
      return
    if (response!.ok === false)
      throw new Error(`Failed to fetch multiple subtitles: HTTP ${response!.status}`)
    const buffer = await lifetime.wait(response!.arrayBuffer())
    if (lifetime.closed)
      return
    const text = new TextDecoder(option.encoding || 'utf-8').decode(buffer!)
    switch (option.type || getExt(option.url!)) {
      case 'srt': return srtToVtt(text)
      case 'ass': return assToVtt(text)
      case 'vtt': return text
      default: return ''
    }
  }
  catch (error) {
    controller?.abort()
    throw error
  }
  finally {
    release()
  }
}
