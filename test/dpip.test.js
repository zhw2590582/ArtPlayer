import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Frozen historical failures remain separate from candidate regression tests.
import test from 'node:test'
import { dpipEnvironment, dpipHistorical } from './helpers/dpip.js'

function deferred() {
  let resolve
  let reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

for (const implementation of await dpipHistorical()) {
  const label = implementation.name

  test(`Document PiP ${label}: rejection retains notice and node identity; retry and pagehide restore once`, async () => {
    let reject = true
    const error = new Error('request denied')
    const env = dpipEnvironment(implementation, { requestWindow: (_, create) => reject ? Promise.reject(error) : Promise.resolve(create()) })
    const result = env.factory()(env.art)
    assert.equal(await result.open(), undefined)
    assert.equal(result.isActive, false)
    assert.equal(env.player.parentNode, env.parent)
    assert.equal(env.warnings[0][1], error)
    assert.match(env.art.notice.show, /open failed/)
    reject = false
    await result.open()
    const win = env.windows[0]
    win.dispatchEvent({ type: 'pagehide' })
    win.dispatchEvent({ type: 'unload' })
    await env.flush()
    assert.equal(result.isActive, false)
    assert.equal(win.closed, true)
    assert.deepEqual(env.parent.children, [env.player, env.sibling])
    assert.deepEqual(env.emitted.filter(event => event.name === 'document-pip').map(event => event.args[0]), [true, false])
    assert.equal([...win.listeners.values()].reduce((sum, set) => sum + set.size, 0), 0)
  })

  test(`Document PiP ${label}: disabled fallback reports an open failure and throwing video fallback rejects unchanged`, async () => {
    const env = dpipEnvironment(implementation, { supported: false })
    const result = env.factory({ fallbackToVideoPiP: false })(env.art)
    await result.open()
    assert.equal(env.art.pip, false)
    assert.match(env.art.notice.show, /open failed/)
    assert.equal(env.requests.length, 0)
    const fallback = dpipEnvironment(implementation, { supported: false })
    const error = new Error('video PiP denied')
    Object.defineProperty(fallback.art, 'pip', { get() {
      return false
    }, set() {
      throw error
    } })
    await assert.rejects(fallback.factory()(fallback.art).open(), value => value === error)
    assert.equal(fallback.warnings.length, 0)
  })

  test(`Document PiP ${label}: close cannot cancel a pending request and late resolution reopens`, async () => {
    const pending = deferred()
    const env = dpipEnvironment(implementation, { requestWindow: () => pending.promise })
    const result = env.factory()(env.art)
    const opening = result.open()
    await result.close()
    assert.equal(result.isActive, false)
    pending.resolve(env.createWindow())
    await opening
    assert.equal(result.isActive, true, 'Historical defect: close lost to pending open')
    assert.notEqual(env.player.ownerDocument, env.document)
    await result.close()
  })

  test(`Document PiP ${label}: destroy does not revoke pending requests or escaped open methods`, async () => {
    const pending = deferred()
    const env = dpipEnvironment(implementation, { requestWindow: () => pending.promise })
    const result = env.factory()(env.art)
    const opening = result.open()
    env.art.destroy()
    pending.resolve(env.createWindow())
    await opening
    assert.equal(env.art.isDestroy, true)
    assert.equal(result.isActive, true, 'Historical defect: late window takes a destroyed player')
    await result.close()
    await result.open()
    assert.equal(env.requests.length, 2, 'Historical escaped method starts another request')
    assert.equal(result.isActive, true)
    await result.close()
  })

  test(`Document PiP ${label}: concurrent opens leak the first window and restore into that window`, async () => {
    const first = deferred()
    const second = deferred()
    let request = 0
    const env = dpipEnvironment(implementation, { requestWindow: () => request++ === 0 ? first.promise : second.promise })
    const result = env.factory()(env.art)
    const a = result.open()
    const b = result.open()
    const firstWindow = env.createWindow()
    const secondWindow = env.createWindow()
    first.resolve(firstWindow)
    await a
    second.resolve(secondWindow)
    await b
    assert.equal(env.requests.length, 2)
    await result.close()
    assert.equal(result.isActive, false)
    assert.equal(firstWindow.closed, false)
    assert.equal(secondWindow.closed, true)
    assert.equal(env.player.ownerDocument, firstWindow.document, 'Historical restore target was overwritten by the second open')
    assert.equal(firstWindow.listeners.get('pagehide').size, 1)
    assert.equal(env.parent.children[0].className, 'artplayer-document-pip-placeholder')
  })

  test(`Document PiP ${label}: delayed open and close resize effects survive terminal destroy`, async () => {
    const delays = []
    const env = dpipEnvironment(implementation, { sleep: () => {
      const pending = deferred()
      delays.push(pending)
      return pending.promise
    } })
    const result = env.factory()(env.art)
    const opening = result.open()
    await env.flush()
    assert.equal(delays.length, 1)
    env.art.destroy()
    assert.equal(delays.length, 2)
    const before = env.emitted.length
    for (const delay of delays) delay.resolve()
    await opening
    await env.flush()
    assert.deepEqual(env.emitted.slice(before).map(event => event.name), ['resize', 'resize'])
    assert.equal(result.isActive, false)
  })

  test(`Document PiP ${label}: destroy during activation leaves a later resize and retained plugin subscriptions`, async () => {
    const env = dpipEnvironment(implementation)
    const result = env.factory()(env.art)
    env.art.on('document-pip', (active) => {
      if (active)
        env.art.destroy()
    })
    await result.open()
    await env.flush()
    assert.equal(result.isActive, false)
    assert.equal(env.controls.has('document-pip'), true)
    assert.equal(env.subscriptions.get('destroy').size, 1)
    assert.equal(env.controls.get('document-pip').node.listeners.get('click').size, 1)
    assert.equal(env.emitted.filter(event => event.name === 'resize').length, 2)
  })

  test(`Document PiP ${label}: failed adoption retains active window and placeholder until explicit close`, async () => {
    const env = dpipEnvironment(implementation, { requestWindow: (_, create) => {
      const win = create()
      win.document.adoptNode = () => {
        throw new Error('adoption refused')
      }
      return Promise.resolve(win)
    } })
    const result = env.factory()(env.art)
    await result.open()
    assert.equal(result.isActive, true)
    assert.equal(env.windows[0].closed, false)
    assert.equal(env.parent.children.length, 3)
    assert.match(env.art.notice.show, /open failed/)
    await result.close()
    assert.deepEqual(env.parent.children, [env.player, env.sibling])
  })

  test(`Document PiP ${label}: moving the placeholder makes restoration detach the player and retain the window`, async () => {
    const env = dpipEnvironment(implementation)
    const result = env.factory()(env.art)
    await result.open()
    const placeholder = env.parent.children[0]
    const alternate = env.document.createElement('section')
    env.document.body.appendChild(alternate)
    alternate.appendChild(placeholder)
    await result.close()
    assert.match(env.art.notice.show, /close failed/)
    assert.equal(result.isActive, true)
    assert.equal(env.windows[0].closed, false)
    assert.equal(env.player.parentNode, null)
    assert.equal(env.windows[0].listeners.get('pagehide').size, 0)
  })

  test(`Document PiP ${label}: foreign ownerDocument styles are omitted while node restoration still works`, async () => {
    const env = dpipEnvironment(implementation)
    const foreign = env.createWindow().document
    const foreignStyle = foreign.createElement('style')
    foreignStyle.textContent = '.foreign { color: red }'
    foreign.head.appendChild(foreignStyle)
    foreign.body.appendChild(env.parent)
    const result = env.factory()(env.art)
    await result.open()
    const win = env.windows[1]
    assert.equal(win.document.querySelectorAll('style').some(style => style.textContent === foreignStyle.textContent), false)
    await result.close()
    assert.equal(env.player.ownerDocument, foreign)
    assert.deepEqual(env.parent.children, [env.player, env.sibling])
  })

  test(`Document PiP ${label}: source replacement keeps player identity and popup resize calls the current method`, async () => {
    const env = dpipEnvironment(implementation)
    const video = env.document.createElement('video')
    env.player.appendChild(video)
    const result = env.factory()(env.art)
    await result.open()
    let resized = 0
    env.art.resize = () => resized++
    video.src = 'second.mp4'
    env.art.emit('restart', video.src)
    env.windows[0].dispatchEvent({ type: 'resize' })
    assert.equal(resized, 1)
    await result.close()
    assert.equal(env.player.children[0], video)
    assert.equal(video.src, 'second.mp4')
    assert.equal(video.ownerDocument, env.document)
  })

  test(`Document PiP ${label}: duplicate evaluation preserves Parcel caching versus newer duplicate style injection`, () => {
    const env = dpipEnvironment(implementation, { readyState: 'loading' })
    env.evaluate()
    env.document.dispatchEvent({ type: 'DOMContentLoaded' })
    const parcelCached = ['published-1.0.1', 'published-1.0.2'].includes(label)
    assert.equal(env.document.querySelectorAll('style').filter(style => style.id === 'artplayer-plugin-document-pip').length, parcelCached ? 1 : 2)
  })
}
