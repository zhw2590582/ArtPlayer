import { errorHandle } from '../utils/error'

export interface TreeItem {
  name?: string
  selector?: TreeItem[]
  readonly $parent?: TreeItem
  readonly $parents?: TreeItem[]
  readonly $option?: TreeItem[]
  readonly $events?: (() => void)[]
  readonly $formatted?: boolean
}

export interface TreeBinding {
  parent?: TreeItem
  parents?: TreeItem[]
  option: TreeItem[]
  events: (() => void)[]
  owner: TreeOwnerState
}

interface TreeOwnerState {
  active: boolean
  root?: TreeItem[]
  scope?: { readonly closed: boolean }
}

interface Placement {
  item: TreeItem
  parent?: TreeItem
  parents?: TreeItem[]
  option: TreeItem[]
  name: string
  generated: boolean
}

const bindings = new WeakMap<TreeItem, TreeBinding>()
const owners = new WeakMap<object, TreeOwnerState>()
const keys = ['$parent', '$parents', '$option', '$events', '$formatted'] as const

export function hasTreeBinding(item: TreeItem): boolean {
  return bindings.has(item)
}

export function registerTreeOwner(owner: object, scope: { readonly closed: boolean }): void {
  owners.set(owner, { active: true, scope })
}

export function releaseTreeOwner(owner: object): void {
  const state = owners.get(owner)
  if (state) {
    state.active = false
    state.root = undefined
    state.scope = undefined
  }
}

function activeBinding(item: TreeItem): boolean {
  const visited = new Set<TreeItem>()
  let current: TreeItem | undefined = item
  while (current && !visited.has(current)) {
    visited.add(current)
    const binding: TreeBinding | undefined = bindings.get(current)
    if (!binding || !binding.owner.active || binding.owner.scope?.closed || !binding.option.includes(current))
      return false
    if (!binding.parent)
      return binding.owner.root === binding.option
    if (bindings.get(binding.parent)?.owner !== binding.owner)
      return false
    current = binding.parent
  }
  return false
}

function canAssignName(item: TreeItem): boolean {
  let target: object | null = item
  while (target) {
    const descriptor = Object.getOwnPropertyDescriptor(target, 'name')
    if (descriptor) {
      if ('set' in descriptor)
        return typeof descriptor.set === 'function'
      return Boolean(descriptor.writable && (target === item || Object.isExtensible(item)))
    }
    target = Object.getPrototypeOf(target)
  }
  return Object.isExtensible(item)
}

export function treeBinding(item: TreeItem): TreeBinding {
  const binding = bindings.get(item)
  if (!binding)
    throw new Error('Setting item has not been formatted')
  return binding
}

export function traverseTree(option: TreeItem[], callback: (item: TreeItem) => void): void {
  for (let index = 0; index < option.length; index++) {
    const item = option[index]!
    callback(item)
    if (item.selector?.length)
      traverseTree(item.selector, callback)
  }
}

export function findItem(option: TreeItem[], name = ''): TreeItem | null {
  let result: TreeItem | null = null
  traverseTree(option, (item) => {
    if (item.name === name)
      result = item
  })
  return result
}

// Validate the complete structure before installing any names or bindings.
export function formatTree<Item extends TreeItem>(owner: { id: number }, option: Item[], parent?: TreeItem, parents?: TreeItem[], names: string[] = []): Item[] {
  const ownerState = owners.get(owner) || { active: true }
  const placements: Placement[] = []
  const seen = new Set<TreeItem>()
  const used = new Set(names)
  const collect = (list: TreeItem[], parent?: TreeItem, parents?: TreeItem[]) => {
    for (let index = 0; index < list.length; index++) {
      const item = list[index]!
      if (!item || typeof item !== 'object')
        throw new TypeError('Setting item must be an object')
      if (seen.has(item))
        throw new Error('Setting items must appear only once in a tree')
      seen.add(item)
      const previous = bindings.get(item)
      if (previous && previous.owner !== ownerState && activeBinding(item))
        errorHandle(false, `Setting item [${item.name || ''}] already belongs to another active player`)
      if (item.name) {
        errorHandle(!used.has(item.name), `The [${item.name}] already exists in [setting]`)
        used.add(item.name)
      }
      if (!bindings.has(item)) {
        for (const key of keys) {
          const descriptor = Object.getOwnPropertyDescriptor(item, key)
          if (descriptor ? !descriptor.configurable : !Object.isExtensible(item))
            throw new TypeError(`Cannot format setting item property [${key}]`)
        }
      }
      if (!item.name && !canAssignName(item))
        throw new TypeError('Cannot assign an automatic setting item name')
      placements.push({ item, parent, parents, option: list, name: item.name || '', generated: !item.name })
      if (item.selector?.length)
        collect(item.selector, item, list)
    }
  }
  collect(option, parent, parents)
  let nextId = owner.id
  owners.set(owner, ownerState)
  ownerState.root = option
  for (const placement of placements) {
    if (!placement.name) {
      do {
        placement.name = `setting-${nextId++}`
      } while (used.has(placement.name))
      used.add(placement.name)
    }
  }
  for (const placement of placements) {
    const { item, name, parent, parents, option } = placement
    const previous = bindings.get(item)
    if (!previous) {
      Object.defineProperties(item, {
        $parent: { get: () => treeBinding(item).parent },
        $parents: { get: () => treeBinding(item).parents },
        $option: { get: () => treeBinding(item).option },
        $events: { get: () => treeBinding(item).events },
        $formatted: { get: () => true },
      })
    }
    bindings.set(item, { parent, parents, option, events: previous?.events || [], owner: ownerState })
    if (placement.generated)
      item.name = name
  }
  // Preserve the caller-provided accumulator and monotonic autogenerated IDs.
  for (const placement of placements) {
    if (!placement.generated)
      names.push(placement.name)
  }
  owner.id = nextId
  return option
}
