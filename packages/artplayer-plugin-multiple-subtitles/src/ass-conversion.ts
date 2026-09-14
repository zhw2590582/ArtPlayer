import type { Converters } from './types'

export default function convertAss(text: string, converter: Converters['assToVtt']): string {
  const converted = converter(text)
  if (!/^WEBVTT \d+ \d+:/.test(converted))
    return converted

  // Core5.1.2 main collapsed template line breaks; compare its complete output
  // before repairing so custom converters and valid headers remain untouched.
  const cues = []
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/Dialogue:\s\d,(\d+:\d{2}:\d{2}\.\d{2}),(\d+:\d{2}:\d{2}\.\d{2}),(?:[^,]*,){6}([\s\S]*)$/i)
    if (!match)
      continue
    const [, start = '', end = '', content = ''] = match
    cues.push({
      start: `${start.replace(/^(\d):/, '0$1:')}0`,
      end: `${end.replace(/^(\d):/, '0$1:')}0`,
      text: content.replace(/\{[\s\S]*?\}/g, '').replace(/\\N/g, '\n').trim().split(/\r?\n/).map(line => line.trim()).join('\n'),
    })
  }
  const collapsed = `WEBVTT ${cues.map((cue, index) => `${index + 1} ${cue.start} --> ${cue.end} ${cue.text}`).join('\n\n')}`
  if (converted !== collapsed)
    return converted
  return `WEBVTT\n\n${cues.map((cue, index) => `${index + 1}\n${cue.start} --> ${cue.end}\n${cue.text}`).join('\n\n')}`
}
