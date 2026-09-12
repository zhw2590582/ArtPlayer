import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate fixes are compared to the immutable workspace via ARTPLAYER_DPIP_BASELINE.
import test from 'node:test'
import { dpipCandidate, dpipEnvironment } from './helpers/dpip.js'

const implementation = await dpipCandidate()
function deferred() {
  let resolve
  let reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
const setup = settings => dpipEnvironment(implementation, settings)

test('Document PiP candidate: public keys, snapshot/default options, controls and transition ordering remain stable', async () => {
  const env = setup()
  const options = { width: 720, placeholder: 'Active' }
  const plugin = env.factory(options)
  options.width = 1
  const result = plugin(env.art)
  assert.deepEqual(Object.keys(result), ['name', 'isSupported', 'isActive', 'open', 'close', 'toggle'])
  assert.equal(Reflect.set(result, 'isActive', true), false)
  assert.equal(result.name, 'artplayerPluginDocumentPip')
  assert.equal(env.controls.get('document-pip').spec.index, 40)
  assert.equal(await result.open(), undefined)
  assert.deepEqual({ ...env.requests[0] }, { width: 720, height: 270 })
  assert.deepEqual(env.emitted.map(event => [event.name, ...event.args]), [['document-pip', true], ['resize']])
  assert.equal(env.parent.children[0].textContent, 'Active')
  assert.equal(env.controls.get('document-pip').node.tooltip, 'Exit PIP Mode')
  assert.equal(await result.close(), undefined)
  assert.deepEqual(env.parent.children, [env.player, env.sibling])
  assert.deepEqual(env.emitted.map(event => [event.name, ...event.args]), [['document-pip', true], ['resize'], ['document-pip', false], ['resize']])
  assert.deepEqual(env.rebinds.map(item => item.document), [env.windows[0].document, env.document])
})

test('Document PiP candidate: normal rejection and unsupported fallback preserve error and return boundaries', async () => {
  const error = new Error('denied')
  const env = setup({ requestWindow: () => Promise.reject(error) })
  const result = env.factory()(env.art)
  assert.equal(await result.open(), undefined)
  assert.equal(env.warnings[0][1], error)
  assert.equal(result.isActive, false)
  const fallback = setup({ supported: false })
  const other = fallback.factory()(fallback.art)
  await other.open()
  assert.equal(fallback.art.pip, true)
  assert.equal(other.isSupported, false)
  Object.defineProperty(fallback.art, 'pip', { get() {
    return false
  }, set() {
    throw error
  } })
  await assert.rejects(other.open(), caught => caught === error)
})

test('Document PiP candidate: overlapping opens issue one request and share one restored window', async () => {
  const pending = deferred()
  const env = setup({ requestWindow: () => pending.promise })
  const result = env.factory()(env.art)
  const first = result.open()
  const second = result.open()
  assert.equal(env.requests.length, 1)
  pending.resolve(env.createWindow())
  await Promise.all([first, second])
  assert.equal(env.parent.children.length, 2)
  await result.close()
  assert.equal(env.windows[0].closed, true)
  assert.deepEqual(env.parent.children, [env.player, env.sibling])
})

test('Document PiP candidate: close settles a pending open and closes the late window without adopting', async () => {
  const pending = deferred()
  const env = setup({ requestWindow: () => pending.promise })
  const result = env.factory()(env.art)
  let settled = false
  const opening = result.open().then(() => {
    settled = true
  })
  await result.close()
  await env.flush()
  assert.equal(settled, true)
  const win = env.createWindow()
  pending.resolve(win)
  await env.flush()
  await opening
  assert.equal(win.closed, true)
  assert.equal(result.isActive, false)
  assert.deepEqual(env.parent.children, [env.player, env.sibling])
  assert.deepEqual(env.emitted, [])
})

test('Document PiP candidate: pending toggle cancels and a fresh request survives the old resolution', async () => {
  const requests = [deferred(), deferred()]
  let index = 0
  const env = setup({ requestWindow: () => requests[index++].promise })
  const result = env.factory()(env.art)
  const old = result.open()
  assert.equal(result.toggle(), undefined)
  const current = result.open()
  const newWin = env.createWindow()
  requests[1].resolve(newWin)
  await current
  const oldWin = env.createWindow()
  requests[0].resolve(oldWin)
  await old
  await env.flush()
  assert.equal(oldWin.closed, true)
  assert.equal(newWin.closed, false)
  assert.equal(env.player.ownerDocument, newWin.document)
  await result.close()
})

test('Document PiP candidate: destroy cancels pending windows and makes escaped methods inert', async () => {
  const pending = deferred()
  const env = setup({ requestWindow: () => pending.promise })
  const result = env.factory()(env.art)
  const opening = result.open()
  env.art.destroy()
  const win = env.createWindow()
  pending.resolve(win)
  await opening
  await env.flush()
  assert.equal(win.closed, true)
  await result.open()
  result.toggle()
  await result.close()
  assert.equal(env.requests.length, 1)
  assert.equal(result.isActive, false)
  assert.equal(env.controls.size, 0)
  assert.equal(env.subscriptions.get('destroy').size, 0)
  assert.equal(env.subscriptions.get('document-pip').size, 0)
})

test('Document PiP candidate: stale rejection after destroy does not write notices', async () => {
  const pending = deferred()
  const env = setup({ requestWindow: () => pending.promise })
  const result = env.factory()(env.art)
  const opening = result.open()
  env.art.destroy()
  pending.reject(new Error('late rejection'))
  await opening
  await env.flush()
  assert.equal(env.warnings.length, 0)
  assert.equal(env.art.notice.show, '')
})

test('Document PiP candidate: destroy cancels owned transition timers and emits no delayed resize', async () => {
  const delay = deferred()
  const env = setup({ sleep: () => delay.promise })
  const result = env.factory()(env.art)
  const opening = result.open()
  await env.flush()
  env.art.destroy()
  assert.equal(env.timers.size, 0)
  const before = env.emitted.length
  delay.resolve()
  await opening
  await env.flush()
  assert.equal(env.emitted.length, before)
  assert.equal(result.isActive, false)
  assert.deepEqual(env.parent.children, [env.player, env.sibling])
})

test('Document PiP candidate: destroy from the active event releases listeners and prevents subsequent effects', async () => {
  const env = setup()
  const result = env.factory()(env.art)
  env.art.on('document-pip', active => active && env.art.destroy())
  await result.open()
  assert.equal(result.isActive, false)
  assert.equal(env.windows[0].closed, true)
  assert.equal([...env.windows[0].listeners.values()].reduce((sum, value) => sum + value.size, 0), 0)
  assert.equal(env.emitted.filter(event => event.name === 'resize').length, 0)
  assert.equal(env.controls.size, 0)
})

test('Document PiP candidate: failed adoption rolls back all window and DOM resources immediately', async () => {
  const env = setup({ requestWindow: (_, create) => {
    const win = create()
    win.document.adoptNode = () => {
      throw new Error('denied adoption')
    }
    return Promise.resolve(win)
  } })
  const result = env.factory()(env.art)
  await result.open()
  assert.equal(result.isActive, false)
  assert.equal(env.windows[0].closed, true)
  assert.deepEqual(env.parent.children, [env.player, env.sibling])
  assert.equal(env.windows[0].document.head.children.length, 0)
  assert.equal(env.windows[0].document.body.children.length, 0)
  assert.match(env.art.notice.show, /open failed/)
})

test('Document PiP candidate: moved or removed placeholders restore to the original parent and sibling', async () => {
  for (const move of [true, false]) {
    const env = setup()
    const result = env.factory()(env.art)
    await result.open()
    const placeholder = env.parent.children[0]
    if (move)
      env.document.body.appendChild(placeholder)
    else
      placeholder.remove()
    await result.close()
    assert.deepEqual(env.parent.children, [env.player, env.sibling])
    assert.equal(result.isActive, false)
    assert.equal(placeholder.parentNode, null)
    assert.equal(env.warnings.length, 0)
  }
})

test('Document PiP candidate: cross-document styles follow the actual player owner and are released', async () => {
  const env = setup()
  const foreign = env.createWindow().document
  foreign.body.appendChild(env.parent)
  const style = foreign.createElement('style')
  style.textContent = '.foreign { color:red }'
  foreign.head.appendChild(style)
  const result = env.factory()(env.art)
  await result.open()
  const target = env.windows[1].document
  assert.equal(target.querySelectorAll('style').some(node => node.textContent === style.textContent), true)
  await result.close()
  assert.equal(env.player.ownerDocument, foreign)
  assert.equal(target.head.children.length, 0)
})

test('Document PiP candidate: duplicate loading evaluation injects one style and removes loading listeners', () => {
  const env = setup({ readyState: 'loading' })
  env.evaluate()
  env.document.dispatchEvent({ type: 'DOMContentLoaded' })
  assert.equal(env.document.querySelectorAll('style').filter(node => node.id === 'artplayer-plugin-document-pip').length, 1)
  assert.equal(env.document.listeners.get('DOMContentLoaded').size, 0)
})

test('Document PiP candidate: registration after destroy creates no controls or listeners', async () => {
  const env = setup()
  env.art.isDestroy = true
  const result = env.factory()(env.art)
  await result.open()
  assert.equal(env.controls.size, 0)
  assert.equal(env.requests.length, 0)
  assert.equal(env.subscriptions.size, 0)
})

test('Document PiP candidate: partial control setup failure releases the click, control and destroy subscription', () => {
  const env = setup()
  const add = env.art.controls.add
  env.art.controls.add = (spec) => {
    add(spec)
    throw new Error('control failure')
  }
  assert.throws(() => env.factory()(env.art), /control failure/)
  assert.equal(env.controls.size, 0)
  assert.equal(env.subscriptions.get('destroy').size, 0)
  assert.equal(env.subscriptions.get('document-pip').size, 0)
})

test('Document PiP candidate: throwing window cleanup still restores DOM and releases remaining resources', async () => {
  const env = setup()
  const result = env.factory()(env.art)
  await result.open()
  const win = env.windows[0]
  const remove = win.removeEventListener
  win.removeEventListener = (...args) => {
    remove(...args)
    if (args[0] === 'resize')
      throw new Error('listener release failed')
  }
  await result.close()
  assert.equal(result.isActive, false)
  assert.equal(win.closed, true)
  assert.deepEqual(env.parent.children, [env.player, env.sibling])
  assert.match(env.art.notice.show, /close failed/)
})

test('Document PiP candidate: a rejecting original parent leaves the player recoverable in its original document', async () => {
  const env = setup()
  const result = env.factory()(env.art)
  await result.open()
  env.parent.insertBefore = () => {
    throw new Error('parent rejects restoration')
  }
  await result.close()
  assert.equal(env.player.parentNode, env.document.body)
  assert.equal(env.player.ownerDocument, env.document)
  assert.equal(env.windows[0].closed, true)
  assert.equal(result.isActive, false)
  assert.match(env.art.notice.show, /close failed/)
})

test('Document PiP candidate: destruction during adoption restores the returned node without reactivating', async () => {
  const env = setup({ requestWindow: (_, create) => {
    const win = create()
    const adopt = win.document.adoptNode
    win.document.adoptNode = (node) => {
      env.art.destroy()
      return adopt(node)
    }
    return Promise.resolve(win)
  } })
  const result = env.factory()(env.art)
  await result.open()
  await env.flush()
  assert.deepEqual(env.parent.children, [env.player, env.sibling])
  assert.equal(env.player.ownerDocument, env.document)
  assert.equal(env.windows[0].closed, true)
  assert.equal(result.isActive, false)
  assert.equal(env.controls.size, 0)
})

test('Document PiP candidate: destruction during style insertion releases nodes created by the interrupted mount', async () => {
  const env = setup({ requestWindow: (_, create) => {
    const win = create()
    const append = win.document.head.appendChild
    win.document.head.appendChild = function (node) {
      env.art.destroy()
      return append.call(this, node)
    }
    return Promise.resolve(win)
  } })
  const result = env.factory()(env.art)
  await result.open()
  await env.flush()
  assert.equal(result.isActive, false)
  assert.deepEqual(env.parent.children, [env.player, env.sibling])
  assert.equal(env.windows[0].document.head.children.length, 0)
})

test('Document PiP candidate: a throwing public notice setter rejects open with the original error', async () => {
  const env = setup({ requestWindow: () => Promise.reject(new Error('window rejected')) })
  const noticeError = new Error('notice setter failed')
  Object.defineProperty(env.art.notice, 'show', { get() {
    return ''
  }, set() {
    throw noticeError
  } })
  const result = env.factory()(env.art)
  await assert.rejects(result.open(), error => error === noticeError)
  assert.equal(result.isActive, false)
})
