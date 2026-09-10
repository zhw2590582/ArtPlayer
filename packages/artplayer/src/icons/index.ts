import { def, getIcon } from '../utils'
import defaults from './defaults'

export default class Icons {
  readonly [key: string]: HTMLElement

  constructor(art: { option: { icons: Record<string, string | HTMLElement> } }) {
    const icons: Record<string, string | HTMLElement | undefined> = { ...defaults, ...art.option.icons }
    for (const key in icons) {
      def(this, key, {
        get: (): HTMLElement => getIcon(key, icons[key]),
      })
    }
  }
}
