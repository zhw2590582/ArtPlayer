// Keep the vendor's lenient aliases while making complete named references exact.
export const cueEntities = {
  '&amp': '&',
  '&amp;': '&',
  '&lt': '<',
  '&lt;': '<',
  '&gt': '>',
  '&gt;': '>',
  '&lrm': '\u200E',
  '&lrm;': '\u200E',
  '&rlm': '\u200F',
  '&rlm;': '\u200F',
  '&nbsp': '\u00A0',
  '&nbsp;': '\u00A0',
}

// Serialization protects the whole VTT once; this protects cue text after onVttLoad unescape.
export function escapeCueText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
