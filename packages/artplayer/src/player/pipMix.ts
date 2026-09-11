import type { PipHost, PipProperty } from '../display/types'
import { nativePip } from '../display/native-pip'
import { webkitPip } from '../display/webkit-pip'
import { isClosing } from '../lifecycle/instance'
import { def } from '../utils'

export default function pipMix(art: PipHost): asserts art is PipHost & PipProperty {
  const { i18n, notice, template: { $video } } = art
  const document = $video.ownerDocument
  if (document.pictureInPictureEnabled && typeof $video.requestPictureInPicture === 'function' && typeof document.exitPictureInPicture === 'function') {
    def(art, 'pip', nativePip(art))
  }
  else if (typeof $video.webkitSupportsPresentationMode === 'function' && typeof $video.webkitSetPresentationMode === 'function') {
    def(art, 'pip', webkitPip(art))
  }
  else {
    def(art, 'pip', {
      get: () => false,
      set() {
        if (!isClosing(art))
          notice.show = i18n.get('PIP Not Supported')
      },
    })
  }
}
