import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node test runner.
import { test } from 'node:test'
import { loadModules } from './helpers/load.js'

const file = 'packages/artplayer/src/setting/model'
const { formatTree, findItem, traverseTree, treeBinding, registerTreeOwner, releaseTreeOwner } = await loadModules(Object.fromEntries(['formatTree', 'findItem', 'traverseTree', 'treeBinding', 'registerTreeOwner', 'releaseTreeOwner'].map(name => [name, { file, name }])))

test('setting format preserves node/array identity, descriptor flags and preorder names', () => {
  const child = { html: 'child' }
  const parent = { name: 'parent', selector: [child] }
  const root = [parent, { name: 'last' }]
  const owner = { id: 0 }
  const names = ['reserved']
  assert.equal(formatTree(owner, root, undefined, undefined, names), root)
  assert.equal(owner.id, 1)
  assert.equal(child.name, 'setting-0')
  assert.deepEqual(names, ['reserved', 'parent', 'last'])
  assert.equal(child.$parent, parent)
  assert.equal(child.$parents, root)
  assert.equal(child.$option, parent.selector)
  assert.equal(parent.$parent, undefined)
  assert.equal(parent.$parents, undefined)
  assert.equal(parent.$option, root)
  assert.equal(child.$formatted, true)
  for (const key of ['$parent', '$parents', '$option', '$events', '$formatted']) {
    const descriptor = Object.getOwnPropertyDescriptor(child, key)
    assert.equal(descriptor.enumerable, false)
    assert.equal(descriptor.configurable, false)
    assert.equal(typeof descriptor.get, 'function')
    assert.equal(descriptor.set, undefined)
  }
  assert.deepEqual(Object.keys(child), ['html', 'name'])
  const visited = []
  traverseTree(root, item => visited.push(item))
  assert.deepEqual(visited, [parent, child, root[1]])
  assert.equal(findItem(root, child.name), child)
  assert.equal(findItem(root, 'missing'), null)
})

test('setting tree rebinding updates parent arrays without redefining immutable getters or events', () => {
  const child = { name: 'child' }
  const previous = { name: 'previous', selector: [child] }
  const next = { name: 'next', selector: [] }
  const owner = { id: 0 }
  const root = [previous, next]
  formatTree(owner, root)
  const getter = Object.getOwnPropertyDescriptor(child, '$parent').get
  const events = child.$events
  const cleanup = () => {}
  events.push(cleanup)
  previous.selector.splice(0)
  next.selector.push(child)
  formatTree(owner, root)
  assert.equal(child.$parent, next)
  assert.equal(child.$parents, root)
  assert.equal(child.$option, next.selector)
  assert.equal(child.$events, events)
  assert.deepEqual(events, [cleanup])
  assert.equal(Object.getOwnPropertyDescriptor(child, '$parent').get, getter)
  assert.equal(treeBinding(child).parent, next)
  assert.equal(owner.id, 0)
})

test('generated setting names avoid explicit names across the entire tree', () => {
  const root = [{}, { name: 'group', selector: [{ name: 'setting-0' }, {}] }]
  const owner = { id: 0 }
  formatTree(owner, root)
  assert.equal(root[0].name, 'setting-1')
  assert.equal(root[1].selector[1].name, 'setting-2')
  assert.equal(owner.id, 3)
  formatTree(owner, root)
  assert.equal(owner.id, 3)
  assert.equal(findItem(root, 'setting-0'), root[1].selector[0])
})

test('duplicate names and cyclic or shared items fail before names and bindings are installed', () => {
  const fresh = {}
  const duplicate = [fresh, { name: 'same' }, { name: 'same' }]
  const owner = { id: 7 }
  const names = []
  assert.throws(() => formatTree(owner, duplicate, undefined, undefined, names), { name: 'ArtPlayerError', message: 'The [same] already exists in [setting]' })
  assert.deepEqual(fresh, {})
  assert.equal(fresh.$formatted, undefined)
  assert.equal(owner.id, 7)
  assert.deepEqual(names, [])
  const cycle = { selector: [] }
  cycle.selector.push(cycle)
  assert.throws(() => formatTree(owner, [cycle]), /only once/)
  assert.equal(cycle.$formatted, undefined)
  assert.throws(() => formatTree(owner, [fresh, fresh]), /only once/)
  assert.equal(fresh.$formatted, undefined)
})

test('invalid property bindings leave earlier entries untouched', () => {
  const fresh = {}
  const foreign = {}
  Object.defineProperty(foreign, '$parent', { get: () => ({}) })
  assert.throws(() => formatTree({ id: 0 }, [fresh, foreign]), /Cannot format setting item property/)
  assert.equal(fresh.name, undefined)
  assert.equal(fresh.$formatted, undefined)
  assert.throws(() => treeBinding(fresh), /has not been formatted/)
})

test('formatting an already-bound frozen node does not rewrite its existing name', () => {
  const child = { name: 'child' }
  const root = [child]
  const owner = { id: 0 }
  formatTree(owner, root)
  Object.freeze(child)
  assert.equal(formatTree(owner, root), root)
  assert.equal(child.$option, root)
})

test('nonextensible metadata and unwritable automatic names fail before binding earlier entries', () => {
  const readonlyName = {}
  Object.defineProperty(readonlyName, 'name', { value: '', writable: false })
  const inheritedName = Object.create(Object.defineProperty({}, 'name', { value: '', writable: false }))
  for (const invalid of [Object.preventExtensions({ name: 'sealed' }), readonlyName, inheritedName]) {
    const fresh = {}
    const owner = { id: 12 }
    const names = []
    assert.throws(() => formatTree(owner, [fresh, invalid], undefined, undefined, names), TypeError)
    assert.deepEqual(Reflect.ownKeys(fresh), [])
    assert.equal(owner.id, 12)
    assert.deepEqual(names, [])
  }
})

test('traversal retains mutation timing and find retains last-match behavior on raw arrays', () => {
  const first = { name: 'same' }
  const last = { name: 'same' }
  const root = [first, last]
  assert.equal(findItem(root, 'same'), last)
  const child = { name: 'added' }
  const visited = []
  traverseTree(root, (item) => {
    visited.push(item)
    if (item === first)
      item.selector = [child]
  })
  assert.deepEqual(visited, [first, child, last])
})

test('active owner conflicts are rejected before mutating either tree', () => {
  const item = { name: 'shared' }
  const first = { id: 0 }
  const second = { id: 0 }
  const scope = { closed: false }
  registerTreeOwner(first, scope)
  const original = [item]
  formatTree(first, original)
  const events = item.$events
  const fresh = {}
  assert.throws(() => formatTree(second, [fresh, item]), { name: 'ArtPlayerError', message: 'Setting item [shared] already belongs to another active player' })
  assert.deepEqual(Reflect.ownKeys(fresh), [])
  assert.equal(item.$option, original)
  assert.equal(item.$events, events)
  assert.equal(second.id, 0)
  scope.closed = true
  const replacement = [item]
  formatTree(second, replacement)
  assert.equal(item.$option, replacement)
  assert.equal(item.$events, events)
  releaseTreeOwner(first)
  assert.throws(() => formatTree(first, original), /another active player/)
})

test('detaching a parent or releasing its owner allows a descendant to be reused', () => {
  const child = { name: 'child' }
  const parent = { name: 'parent', selector: [child] }
  const root = [parent]
  const first = { id: 0 }
  const second = { id: 0 }
  formatTree(first, root)
  const getter = Object.getOwnPropertyDescriptor(child, '$parent').get
  assert.throws(() => formatTree(second, [child]), /another active player/)
  root.splice(0)
  const replacement = [child]
  formatTree(second, replacement)
  assert.equal(child.$parent, undefined)
  assert.equal(Object.getOwnPropertyDescriptor(child, '$parent').get, getter)
  releaseTreeOwner(second)
  root.push(parent)
  formatTree(first, root)
  assert.equal(child.$parent, parent)
  assert.equal(child.$parents, root)
})
