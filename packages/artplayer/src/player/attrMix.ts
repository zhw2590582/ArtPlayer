import { def } from '../utils'

export interface AttributeMethods {
  attr: {
    (key: PropertyKey): unknown
    (key: PropertyKey, value: unknown): unknown
  }
}

export default function attrMix(art: { template: { $video: object } }): void {
  const {
    template: { $video },
  } = art

  def(art, 'attr', {
    value(key: PropertyKey, value?: unknown): unknown {
      // attr intentionally exposes arbitrary native/proxy properties, including symbols.
      const target = $video as Record<PropertyKey, unknown>
      if (value === undefined)
        return target[key]
      target[key] = value
    },
  })
}
