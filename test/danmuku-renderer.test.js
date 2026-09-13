import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Deterministic owned-node tests use the Node runner.
import test from 'node:test'
import { parseHTML } from 'linkedom'
import { loadModules } from './helpers/load.js'

const { Renderer } = await loadModules({ Renderer: 'packages/artplayer-plugin-danmuku/src/renderer' })

function fixture(t) {
  const { document } = parseHTML('<html><body><div id="layer"><i id="foreign"></i></div></body></html>')
  const previous = globalThis.document
  globalThis.document = document
  t.after(() => {
    if (previous === undefined)
      delete globalThis.document
    else
      globalThis.document = previous
  })
  const owner = {
    constructor: { cssText: 'visibility:hidden;position:absolute' },
    $danmuku: document.querySelector('#layer'),
    $refs: [],
    queue: [],
    option: { opacity: 0.7 },
    fontSize: 20,
    utils: { setStyles: (node, styles) => Object.assign(node.style, styles) },
  }
  const renderer = new Renderer(owner)
  Object.defineProperty(owner, '$ref', { get: () => renderer.acquire() })
  return { owner, renderer, document }
}

test('Danmuku renderer destroys only owned nodes, including moved and idle nodes, and clears retained references', (t) => {
  const { owner, renderer, document } = fixture(t)
  const active = renderer.acquire()
  const idle = renderer.acquire()
  owner.$danmuku.append(active, idle)
  owner.queue.push({ $ref: active })
  owner.$refs.push(idle)
  document.body.append(active)
  renderer.destroy()
  assert.equal(active.parentElement, null)
  assert.equal(idle.parentElement, null)
  assert.equal(owner.$danmuku.firstElementChild.id, 'foreign')
  assert.equal(owner.queue[0].$ref, null)
  assert.equal(owner.$refs.length, 0)
  assert.equal(renderer.nodes.size, 0)
  renderer.destroy()
  assert.equal(owner.$danmuku.childElementCount, 1)
})

test('Danmuku renderer cancellation cannot recycle a different operation node', (t) => {
  const { owner, renderer } = fixture(t)
  const old = renderer.acquire()
  const current = renderer.acquire()
  const row = { $ref: current }
  const operation = { danmu: row, ref: old }
  renderer.release(operation)
  assert.equal(row.$ref, current)
  assert.equal(operation.ref, null)
  assert.deepEqual(owner.$refs, [])
  const actual = { danmu: row, ref: current }
  renderer.release(actual)
  renderer.release(actual)
  assert.deepEqual(owner.$refs, [current])
  assert.equal(row.$ref, null)
  assert.equal(current.style.visibility, 'hidden')
})

test('Danmuku renderer reuse clears custom style and identity before preparing the next row', (t) => {
  const { owner, renderer } = fixture(t)
  const first = { text: 'first', color: '#fff', border: true, style: { letterSpacing: '3px' } }
  const operation = {}
  const ref = renderer.prepare(first, operation)
  ref.dataset.id = 'old'
  ref.className = 'old-class'
  assert.equal(ref.style.letterSpacing, '3px')
  renderer.release(operation)
  const second = { text: 'second', color: '#000', style: {} }
  const next = renderer.prepare(second, {})
  assert.equal(next, ref)
  assert.equal(next.textContent, 'second')
  assert.equal(next.dataset.id, '')
  assert.equal(next.className, '')
  assert.equal(next.style.letterSpacing || '', '')
  assert.equal(next.style.visibility, 'hidden')
  assert.equal(owner.$danmuku.querySelectorAll('div').length, 1)
})

test('Danmuku renderer replacement clears the historical whole layer and moved owned nodes before starting a new pool', (t) => {
  const { owner, renderer, document } = fixture(t)
  const old = renderer.acquire()
  const moved = renderer.acquire()
  const foreign = document.createElement('aside')
  owner.$danmuku.append(old)
  document.body.append(moved, foreign)
  owner.$refs.push(old)
  renderer.clear()
  assert.equal(owner.$danmuku.childElementCount, 0)
  assert.equal(old.parentElement, null)
  assert.equal(moved.isConnected, false)
  assert.equal(foreign.isConnected, true)
  assert.equal(renderer.nodes.size, 0)
  assert.equal(owner.$refs.length, 0)
  assert.notEqual(renderer.acquire(), old)
  renderer.destroy()
  assert.equal(foreign.isConnected, true)
})

test('Danmuku renderer left uses the existing auto-orientation axis', (t) => {
  const { owner, renderer } = fixture(t)
  const node = renderer.acquire()
  node.getBoundingClientRect = () => ({ top: 31, left: 72 })
  assert.equal(renderer.left(node), 72)
  owner.isRotate = true
  assert.equal(renderer.left(node), 31)
})
