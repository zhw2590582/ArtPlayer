import type { ComponentHost, EntryOption } from '../component/types'
import type { QualityItem } from '../control/types'
import { captureSelection } from '../component/selection'
import { isClosing } from '../lifecycle/instance'
import { def } from '../utils'

export interface QualityHost extends ComponentHost {
  controls: { update: (option: EntryOption<QualityHost>) => unknown }
  notice: { set show(message: string) }
  i18n: { get: (key: string) => string }
  switchQuality: (url: string) => Promise<unknown>
}

export default function qualityMix(art: QualityHost): void {
  def(art, 'quality', {
    set(quality: QualityItem[]) {
      const { controls, notice, i18n } = art
      const qualityDefault = quality.find(item => item.default) || quality[0]
      controls.update({
        name: 'quality',
        position: 'right',
        index: 10,
        style: { marginRight: '10px' },
        html: qualityDefault?.html || '',
        selector: quality,
        async onSelect(item, _element, event) {
          const active = captureSelection(event)
          // This callback is installed with the quality array above.
          await art.switchQuality((item as QualityItem).url)
          if (!isClosing(art) && active()) {
            const message = `${i18n.get('Switch Video')}: ${item.html}`
            if (!isClosing(art) && active())
              notice.show = message
          }
          return item.html
        },
      })
    },
  })
}
