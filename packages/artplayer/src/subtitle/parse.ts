import type { SubtitleOption } from './types'
import { getExt } from '../utils'
import { assToVtt, srtToVtt } from '../utils/subtitle'

// Keep conversion and callback binding identical to the public utility parsers.
export function parseSubtitle(buffer: ArrayBuffer, option: SubtitleOption): { vtt: string } | undefined {
  const text = new TextDecoder(option.encoding).decode(buffer)
  switch (option.type || getExt(option.url)) {
    case 'srt': return { vtt: option.onVttLoad(srtToVtt(text)) }
    case 'ass': return { vtt: option.onVttLoad(assToVtt(text)) }
    case 'vtt': return { vtt: option.onVttLoad(text) }
    default: return undefined
  }
}
