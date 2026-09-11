import type { CssVariableMethods } from './cssVarMix'
import { def } from '../utils'

export default function themeMix(art: CssVariableMethods): void {
  def(art, 'theme', {
    get() {
      return art.cssVar('--art-theme')
    },
    set(theme: string) {
      art.cssVar('--art-theme', theme)
    },
  })
}
