import type { Utilities } from './types'

let nextId = 0

export function createContainer(utils: Utilities): HTMLDivElement {
  const container = utils.createElement('div')
  container.id = `art-vast-${Date.now()}-${++nextId}`
  utils.setStyles(container, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '150',
    backgroundColor: 'black',
    display: 'none',
    pointerEvents: 'auto',
  })
  return container
}
