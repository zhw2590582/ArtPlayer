import { def } from '../utils'

export interface CssVariableMethods {
  cssVar: {
    (key: string): string
    (key: string, value: unknown): string | void
  }
}

export default function cssVarMix(art: { template: { $player: HTMLElement } }): void {
  const { $player } = art.template

  def(art, 'cssVar', {
    value(key: string, value?: unknown): string | void {
      if (value) {
        // Retain Web IDL conversion and the historical truthy write condition.
        return $player.style.setProperty(key, value as string)
      }
      else {
        return getComputedStyle($player).getPropertyValue(key)
      }
    },
  })
}
