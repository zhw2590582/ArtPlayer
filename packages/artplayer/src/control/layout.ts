import type { ControlHost } from './types'
import { entryScope } from '../component/resources'
import { controlEvents } from './resources'

export function observeControlLayout(art: ControlHost): void {
  const { $bottom, $controls, $player } = art.template
  const scope = entryScope($bottom)
  const { on } = controlEvents(art, $bottom)
  const update = () => {
    if (scope.closed)
      return
    // Layout height is unaffected by the player's rotation/scale transform.
    const height = $controls.offsetHeight
    if (height > 0 && $player.style.getPropertyValue('--art-controls-height') !== `${height}px`)
      $player.style.setProperty('--art-controls-height', `${height}px`)
  }
  on('resize', update)
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(update)
    observer.observe($controls)
    scope.add(() => {
      observer.disconnect()
    })
  }
  else if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(update)
    observer.observe($controls, { childList: true, subtree: true, attributes: true, characterData: true })
    scope.add(() => {
      observer.disconnect()
    })
  }
  update()
}
