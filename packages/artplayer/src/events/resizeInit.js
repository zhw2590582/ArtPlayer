import { getScope } from '../lifecycle/instance'
import { timeout } from '../lifecycle/resources'

export default function resizeInit(art, events) {
  const { option, constructor } = art

  art.on('resize', () => {
    const { aspectRatio, notice } = art
    if (art.state === 'standard' && option.autoSize) {
      art.autoSize()
    }
    art.aspectRatio = aspectRatio
    notice.show = ''
  })

  const scope = getScope(art)
  let cancel = () => {}
  const resizeFn = () => {
    cancel()
    cancel = timeout(scope, () => art.emit('resize'), constructor.RESIZE_TIME)
  }

  art.on('window:orientationchange', () => resizeFn())
  art.on('window:resize', () => resizeFn())

  if (screen && screen.orientation && screen.orientation.onchange) {
    events.proxy(screen.orientation, 'change', () => resizeFn())
  }
}
