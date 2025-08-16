import { isInViewport, throttle } from '../utils'

export default function viewInit(art) {
  const {
    option,
    constructor,
    template: { $container },
  } = art

  const scrollFn = throttle(() => {
    art.emit('view', isInViewport($container, constructor.SCROLL_GAP))
  }, constructor.SCROLL_TIME)

  art.on('window:scroll', () => scrollFn())

  art.on('view', (state) => {
    if (option.autoMini) {
      art.mini = !state
    }
  })
}
