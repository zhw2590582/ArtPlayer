import type { CaptionHost } from './types'

export default function renderLegacyCaptions(art: CaptionHost): void {
  const cues = art.subtitle?.textTrack?.activeCues
  if (!cues || cues.length < 2)
    return

  const texts = Array.from(cues, cue => 'text' in cue && typeof cue.text === 'string' ? cue.text : '')
  const target = art.template.$subtitle
  if (art.option?.subtitle?.escape) {
    target.innerHTML = ''
    for (const text of texts) {
      for (const line of text.split(/\r?\n/)) {
        const element = target.ownerDocument.createElement('div')
        element.className = 'art-subtitle-line'
        element.textContent = line
        target.appendChild(element)
      }
    }
  }
  else {
    target.innerHTML = texts.join('')
  }
}
