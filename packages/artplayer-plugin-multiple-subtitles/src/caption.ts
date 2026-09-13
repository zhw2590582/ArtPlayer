import type Artplayer from 'artplayer'
import type { Lifetime } from './types'
import { TIMESTAMP_CLASS } from './merge'

export default function installCaptionView(art: Pick<Artplayer, 'on' | 'off' | 'template'>, lifetime: Lifetime): void {
  function update(): void {
    if (lifetime.closed)
      return
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
  lifetime.own(() => art.off('subtitleAfterUpdate', update))
  art.on('subtitleAfterUpdate', update)
}
