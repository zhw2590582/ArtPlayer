import type { ControlFactory, ControlOption } from './types'
import { installProgressInteractions } from './progress/interactions'
import { mountProgressView } from './progress/view'

export { getPosFromEvent, setCurrentTime } from './progress/position'

export default function progress(options: ControlOption): ControlFactory {
  return art => ({
    ...options,
    html: `
                <div class="art-control-progress-inner">
                    <div class="art-progress-hover"></div>
                    <div class="art-progress-loaded"></div>
                    <div class="art-progress-played"></div>
                    <div class="art-progress-highlight"></div>
                    <div class="art-progress-indicator"></div>
                    <div class="art-progress-tip">00:00</div>
                </div>
            `,
    mounted: ($control) => {
      mountProgressView(art, $control)
      installProgressInteractions(art, $control)
    },
  })
}
