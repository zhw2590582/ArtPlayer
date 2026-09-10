import type { SettingItem } from './types'

type CaptureState = () => () => void
const states = new WeakMap<SettingItem, CaptureState>()

export function rememberSettingState(item: SettingItem, capture?: CaptureState): void {
  if (capture)
    states.set(item, capture)
  else
    states.delete(item)
}

// Capture descriptors without invoking user getters while preparing a render.
export function captureSettingItem(item: SettingItem): () => void {
  const descriptors = new Map(Reflect.ownKeys(item).map(key => [key, Object.getOwnPropertyDescriptor(item, key)!]))
  const nodes: { node: Node, parent: Node | null, next: Node | null }[] = []
  const state = states.get(item)
  const restoreState = state?.()
  for (const key of ['html', 'icon', 'tooltip']) {
    const value: unknown = descriptors.get(key)?.value
    if (value instanceof Node)
      nodes.push({ node: value, parent: value.parentNode, next: value.nextSibling })
  }
  return () => {
    for (const key of Reflect.ownKeys(item)) {
      if (!descriptors.has(key) && Object.getOwnPropertyDescriptor(item, key)?.configurable)
        Reflect.deleteProperty(item, key)
    }
    for (const [key, descriptor] of descriptors)
      Object.defineProperty(item, key, descriptor)
    restoreState?.()
    rememberSettingState(item, state)
    for (const { node, parent, next } of nodes) {
      if (parent)
        parent.insertBefore(node, next?.parentNode === parent ? next : null)
      else
        node.parentNode?.removeChild(node)
    }
  }
}
