import { def, setStyle } from '../utils'

export default function posterMix(art: { template: { $poster: HTMLElement } }): void {
  const {
    template: { $poster },
  } = art

  def(art, 'poster', {
    get: () => {
      try {
        return $poster.style.backgroundImage.match(/"(.*)"/)![1]!
      }
      catch {
        return ''
      }
    },
    set(url: string) {
      setStyle($poster, 'backgroundImage', `url(${url})`)
    },
  })
}
