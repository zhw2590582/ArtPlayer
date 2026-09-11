import { def } from '../utils'

export default function typeMix(art: { option: { type: string } }): void {
  def(art, 'type', {
    get() {
      return art.option.type
    },
    set(type: string) {
      art.option.type = type
    },
  })
}
