export function clamp(num: number, a: number, b: number): number {
  return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b))
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function secondToTime(second: number): string {
  if (!second)
    return '00:00'
  const add0 = (num: number) => (num < 10 ? `0${num}` : String(num))
  const hour = Math.floor(second / 3600)
  const min = Math.floor((second - hour * 3600) / 60)
  const sec = Math.floor(second - hour * 3600 - min * 60)
  return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':')
}

const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '\'': '&#39;',
  '"': '&quot;',
}
const unescapeMap: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&#39;': '\'',
  '&quot;': '"',
}
const unescapePattern = /(&amp;|&lt;|&gt;|&#39;|&quot;)/g

export function escape(str: string): string {
  return str.replace(
    /[&<>'"]/g,
    tag => escapeMap[tag] || tag,
  )
}

export function unescape(str: string): string {
  return str.replace(unescapePattern, tag => unescapeMap[tag] || tag)
}
