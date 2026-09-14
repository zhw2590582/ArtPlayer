import type { Utilities } from './types'

let nextId = 0

export function createContainer(utils: Utilities, workspaceMode: boolean): HTMLDivElement {
  const container = utils.createElement('div')
  container.id = `${workspaceMode ? 'art-vast-' : 'art-'}${Date.now()}-${++nextId}`
  utils.setStyles(container, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '150',
    display: 'none',
  })
  if (workspaceMode)
    utils.setStyles(container, { backgroundColor: 'black', pointerEvents: 'auto' })
  return container
}
