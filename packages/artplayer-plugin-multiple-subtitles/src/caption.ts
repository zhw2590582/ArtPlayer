import type { CaptionHost, Lifetime } from './types'
import renderLegacyCaptions from './legacy-caption'
import { TIMESTAMP_CLASS } from './merge'

export default function installCaptionView(art: CaptionHost, lifetime: Lifetime): void {
  const legacy = !!art.subtitle && 'activeCue' in art.subtitle && !('activeCues' in art.subtitle)
  const event = legacy ? 'subtitleUpdate' : 'subtitleAfterUpdate'
  function update(): void {
    if (lifetime.closed)
      return
    if (legacy)
      renderLegacyCaptions(art)
    // HTML does not pair <c.class> with </c>; unwrap while preserving following caption nodes.
    for (const marker of Array.from(art.template.$subtitle.getElementsByTagName(`c.${TIMESTAMP_CLASS}`))) {
      const first = marker.firstChild
      if (first?.nodeType === 3)
        first.nodeValue = (first.nodeValue || '').replace(/^<(?:\d+:)?\d{2}:\d{2}\.\d{3}>/, '')
      marker.replaceWith(...Array.from(marker.childNodes))
    }
  }
  if (lifetime.closed)
    return
  lifetime.own(() => art.off(event, update))
  art.on(event, update)
}
