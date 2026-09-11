import { def, getIcon } from '../utils'
import defaults from './defaults'

// eslint-disable-next-line ts/no-unsafe-declaration-merging -- The constructor defines a getter for every default key without class fields.
interface Icons extends Record<keyof typeof defaults, HTMLElement> {}

// eslint-disable-next-line ts/no-unsafe-declaration-merging -- The merged mapped interface describes the getters installed below.
class Icons {
  readonly [key: string]: HTMLElement

  constructor(art: { option: { icons: Readonly<Record<string, string | HTMLElement | undefined>> } }) {
    const icons: Record<string, string | HTMLElement | undefined> = { ...defaults, ...art.option.icons }
    for (const key in icons) {
      def(this, key, {
        get: (): HTMLElement => getIcon(key, icons[key]),
      })
    }
  }
}

export default Icons
