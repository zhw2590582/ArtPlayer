import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Real-template controlled DOM regressions use the Node runner.
import test from 'node:test'
import { danmukuCandidate } from './helpers/danmuku-candidate.js'
import { danmukuSettingEnvironment } from './helpers/danmuku-setting.js'
import { danmukuHistorical, deferred } from './helpers/danmuku.js'

const candidate = await danmukuCandidate()
const historical = await danmukuHistorical()
const emitted = env => env.events.filter(event => event.name === 'artplayerPluginDanmuku:emit')

function fixture(implementation = candidate, option = {}, environment = {}) {
  const env = danmukuSettingEnvironment(implementation, environment)
  const plugin = env.factory({ danmuku: [], mount: '#external', ...option })(env.art)
  return { env, plugin, owner: plugin.show(), ui: env.query('.artplayer-plugin-danmuku') }
}

for (const implementation of [...historical, candidate]) {
  test(`Danmuku Setting ${implementation.name}: static icons and the actual template retain published structure`, () => {
    const { env, plugin, ui } = fixture(implementation)
    const reference = danmukuSettingEnvironment(historical[0]).factory.icons
    assert.deepEqual(Object.keys(env.factory.icons), Object.keys(reference))
    for (const key of Object.keys(reference))
      assert.equal(env.factory.icons[key], reference[key])
    assert.equal(Object.getOwnPropertyDescriptor(env.factory, 'icons').writable, true)
    assert.equal(ui.parentElement.id, 'external')
    assert.equal(ui.querySelectorAll('.apd-config-mode .apd-mode').length, 3)
    assert.equal(ui.querySelectorAll('.apd-style-mode .apd-mode').length, 3)
    assert.equal(ui.querySelectorAll('.apd-color').length, 14)
    assert.equal(ui.querySelectorAll('.apd-slider').length, 4)
    assert.equal(ui.querySelectorAll('.apd-config-speed .apd-slider-step').length, 3)
    assert.equal(ui.querySelector('.apd-input').getAttribute('maxLength'), String(plugin.option.maxLength))
    assert.equal(env.query('#unrelated').textContent, 'Keep me')
    env.destroy()
  })

  test(`Danmuku Setting ${implementation.name}: mount/fullscreen and responsive moves preserve one actual UI subtree`, () => {
    const { env, plugin, ui } = fixture(implementation)
    assert.equal(plugin.mount('#second'), undefined)
    assert.equal(ui.parentElement.id, 'second')
    assert.equal(env.query('#external').children.length, 1)
    for (const type of ['fullscreen', 'fullscreenWeb']) {
      env.art.emit(type, true)
      assert.equal(ui.parentElement, env.art.template.$controlsCenter)
      env.art.emit(type, false)
      assert.equal(ui.parentElement.id, 'second')
    }
    assert.equal(plugin.mount(env.art.template.$controlsCenter), undefined)
    env.art.width = 400
    env.art.emit('resize')
    assert.equal(ui.parentElement, env.art.template.$player)
    env.art.width = 640
    env.art.emit('resize')
    assert.equal(ui.parentElement, env.art.template.$controlsCenter)
    assert.equal(env.document.querySelectorAll('.artplayer-plugin-danmuku').length, 1)
    env.destroy()
  })

  test(`Danmuku Setting ${implementation.name}: Slider clicks, pointer dragging and rotation update actual controls`, () => {
    const { env, plugin, ui } = fixture(implementation)
    const opacity = ui.querySelector('.apd-config-opacity .apd-slider')
    opacity.testRect = { left: 20, top: 30, width: 100, height: 200 }
    env.dispatch(opacity, 'click', { clientX: 45 })
    assert.equal(plugin.option.opacity, 0.25)
    assert.equal(ui.querySelector('.apd-config-opacity .apd-value').textContent, '25%')
    assert.equal(opacity.querySelector('.apd-slider-dot').style.left, '25%')
    env.dispatch(opacity, 'pointerdown', { button: 0 })
    env.art.emit('document:pointermove', { clientX: 90 })
    assert.equal(plugin.option.opacity, 0.7)
    env.art.emit('document:pointerup', { clientX: 120 })
    assert.equal(plugin.option.opacity, 1)
    env.art.emit('document:pointermove', { clientX: 20 })
    assert.equal(plugin.option.opacity, 1)
    env.art.isRotate = true
    env.dispatch(opacity, 'click', { clientY: 130 })
    assert.equal(plugin.option.opacity, 0.5)
    const speed = ui.querySelector('.apd-config-speed .apd-slider')
    speed.testRect = { width: 100, height: 100 }
    env.dispatch(speed, 'click', { clientY: 25 })
    assert.equal(plugin.option.speed, 7.5, 'Hidden step labels do not remove numeric slider indices')
    assert.equal(ui.querySelector('.apd-config-speed .apd-value').textContent, '\u8F83\u6162')
    env.destroy()
  })

  test(`Danmuku Setting ${implementation.name}: beforeEmit receiver, strict true acceptance and local original rejection stay compatible`, async () => {
    const gate = deferred()
    let receiver
    let inputDanmu
    const { env, plugin, owner, ui } = fixture(implementation, {
      beforeEmit(danmu) {
        receiver = this
        inputDanmu = danmu
        return gate.promise
      },
    })
    const input = ui.querySelector('.apd-input')
    input.value = '  accepted text  '
    env.dispatch(ui.querySelector('.apd-send'), 'click')
    assert.equal(receiver, plugin.option)
    assert.equal(inputDanmu.text, 'accepted text')
    assert.equal(inputDanmu.time, 10)
    gate.resolve(true)
    await env.flush()
    assert.equal(owner.queue.length, 1)
    assert.equal(owner.queue[0].border, true)
    assert.equal(owner.queue[0].time, 10.5)
    assert.equal(input.value, '')
    assert.equal(env.timers.size, 1)
    assert.equal(ui.querySelector('.apd-send').classList.contains('apd-lock'), true)
    env.destroy()

    const error = new Error('beforeEmit original')
    const denied = fixture(implementation, { beforeEmit: () => Promise.reject(error) })
    denied.ui.querySelector('.apd-input').value = 'retained'
    denied.env.dispatch(denied.ui.querySelector('.apd-send'), 'click')
    await denied.env.flush()
    assert.equal(denied.owner.queue.length, 0)
    assert.equal(denied.ui.querySelector('.apd-input').value, 'retained')
    assert.equal(denied.env.timers.size, 0)
    assert.deepEqual(denied.env.consoleErrors, [['Error emitting danmuku:', error]])
    assert.equal(denied.env.events.filter(event => event.name === 'artplayerPluginDanmuku:error').length, 0)
    denied.plugin.config({ beforeEmit: () => 1 })
    denied.env.dispatch(denied.ui.querySelector('.apd-send'), 'click')
    await denied.env.flush()
    assert.equal(denied.owner.queue.length, 0)
    assert.equal(denied.env.timers.size, 0)
    denied.env.destroy()
  })
}

test(`Danmuku Setting ${candidate.name}: destroy removes external UI, subscriptions, proxy handlers and pending lock work`, async () => {
  const { env, ui } = fixture()
  const input = ui.querySelector('.apd-input')
  input.value = 'send once'
  env.dispatch(ui.querySelector('.apd-send'), 'click')
  await env.flush()
  assert.equal(env.timers.size, 1)
  assert.ok(env.listenerCount() > 0)
  assert.ok(env.proxyCount() > 0)
  env.destroy()
  assert.equal(ui.parentElement, null)
  assert.equal(env.query('#unrelated').textContent, 'Keep me')
  assert.equal(env.timers.size, 0)
  assert.equal(env.listenerCount(), 0)
  assert.equal(env.proxyCount(), 0)
  const events = env.events.length
  env.dispatch(ui.querySelector('.apd-toggle'), 'click')
  env.dispatch(ui.querySelector('.apd-send'), 'click')
  await env.flush()
  assert.equal(env.events.length, events)
  assert.ok(env.workers.every(worker => worker.terminated))
})

test(`Danmuku Setting ${candidate.name}: destroy cancels pending beforeEmit without sending, clearing input or locking`, async () => {
  const gate = deferred()
  const { env, owner, ui } = fixture(candidate, { beforeEmit: () => gate.promise })
  const input = ui.querySelector('.apd-input')
  input.value = 'pending user text'
  env.dispatch(ui.querySelector('.apd-send'), 'click')
  env.destroy()
  const count = emitted(env).length
  gate.resolve(true)
  await env.flush()
  assert.equal(owner.queue.length, 0)
  assert.equal(emitted(env).length, count)
  assert.equal(input.value, 'pending user text')
  assert.equal(ui.querySelector('.apd-send').classList.contains('apd-lock'), false)
  assert.equal(env.timers.size, 0)
})

test(`Danmuku Setting ${candidate.name}: invalid initial mount rolls back template, Worker, subscriptions and proxies`, () => {
  const env = danmukuSettingEnvironment(candidate)
  assert.throws(() => env.factory({ danmuku: [], mount: '#missing' })(env.art), /Can not find the mount point: #missing/u)
  assert.equal(env.listenerCount(), 0)
  assert.equal(env.proxyCount(), 0)
  assert.equal(env.timers.size, 0)
  assert.equal(env.document.querySelectorAll('.artplayer-plugin-danmuku').length, 0)
  assert.ok(env.workers.every(worker => worker.terminated))
  assert.equal(env.query('#unrelated').textContent, 'Keep me')
})

test(`Danmuku Setting ${candidate.name}: late DOMContentLoaded installs only the shared style and releases its listener after instance destruction`, () => {
  const { env, ui } = fixture(candidate, {}, { readyState: 'loading' })
  assert.equal(env.document.getElementById('artplayer-plugin-danmuku'), null)
  env.destroy()
  env.dispatch(env.document, 'DOMContentLoaded')
  const style = env.document.getElementById('artplayer-plugin-danmuku')
  assert.ok(style)
  assert.ok(style.textContent.includes('.artplayer-plugin-danmuku'))
  assert.equal(ui.parentElement, null)
  assert.equal(env.proxyCount(), 0)
  assert.equal(env.documentListeners.filter(record => record.type === 'DOMContentLoaded' && record.active).length, 0)
  env.dispatch(env.document, 'DOMContentLoaded')
  assert.equal(env.document.querySelectorAll('#artplayer-plugin-danmuku').length, 1)
})

test(`Danmuku Setting ${candidate.name}: repeated bundle evaluation shares pending style installation`, () => {
  const env = danmukuSettingEnvironment(candidate, { readyState: 'loading' })
  env.reloadPlugin()
  env.reloadPlugin()
  assert.equal(env.documentListeners.filter(record => record.type === 'DOMContentLoaded' && record.active).length, 1)
  env.dispatch(env.document, 'DOMContentLoaded')
  assert.equal(env.document.querySelectorAll('#artplayer-plugin-danmuku').length, 1)
  assert.equal(env.documentListeners.filter(record => record.type === 'DOMContentLoaded' && record.active).length, 0)
  env.reloadPlugin()
  assert.equal(env.document.querySelectorAll('#artplayer-plugin-danmuku').length, 1)
  assert.equal(env.documentListeners.filter(record => record.type === 'DOMContentLoaded' && record.active).length, 0)
})

test(`Danmuku Setting ${candidate.name}: Enter starts one pending send and preserves a synchronous destroy decision`, async () => {
  let calls = 0
  const env = danmukuSettingEnvironment(candidate)
  const plugin = env.factory({
    danmuku: [],
    beforeEmit() {
      calls++
      env.destroy()
      return true
    },
  })(env.art)
  const input = env.query('.apd-input')
  const send = env.query('.apd-send')
  input.value = 'retain on synchronous destroy'
  const keypress = env.event('keypress', { key: 'Enter' })
  input.dispatchEvent(keypress)
  await env.flush()
  assert.equal(keypress.defaultPrevented, true)
  assert.equal(calls, 1)
  assert.equal(plugin.show().queue.length, 0)
  assert.equal(input.value, 'retain on synchronous destroy')
  assert.equal(send.classList.contains('apd-lock'), false)
  assert.equal(env.timers.size, 0)
  assert.equal(env.proxyCount(), 0)
})

test(`Danmuku Setting ${candidate.name}: pending sends are deduplicated and a rejection after destroy is observed without late UI work`, async () => {
  const gate = deferred()
  let calls = 0
  const { env, ui } = fixture(candidate, {
    beforeEmit() {
      calls++
      return gate.promise
    },
  })
  const input = ui.querySelector('.apd-input')
  input.value = 'pending rejection'
  env.dispatch(ui.querySelector('.apd-send'), 'click')
  env.dispatch(input, 'keypress', { key: 'Enter' })
  assert.equal(calls, 1)
  env.destroy()
  gate.reject(new Error('cancelled beforeEmit rejection'))
  await env.flush()
  assert.equal(input.value, 'pending rejection')
  assert.equal(env.timers.size, 0)
  assert.equal(emitted(env).length, 0)
  assert.equal(env.consoleErrors.length, 0)
})

test(`Danmuku Setting ${candidate.name}: rejection from the invoked emit Promise is observed with the original error`, async () => {
  const error = new Error('filter failed during accepted send')
  const { env, ui } = fixture(candidate, {
    filter() {
      throw error
    },
  })
  const input = ui.querySelector('.apd-input')
  input.value = 'accepted but rejected by filter'
  env.dispatch(ui.querySelector('.apd-send'), 'click')
  await env.flush()
  assert.deepEqual(env.consoleErrors, [['Error emitting danmuku:', error]])
  assert.equal(env.events.filter(event => event.name === 'artplayerPluginDanmuku:error').length, 0)
  assert.equal(input.value, '', 'Sending still clears and locks immediately after invoking emit')
  assert.equal(env.timers.size, 1)
  env.destroy()
})

test(`Danmuku Setting ${candidate.name}: a complete lock countdown retains its existing delay and restores the actual send control`, async () => {
  const { env, ui } = fixture(candidate, { lockTime: 1 })
  ui.querySelector('.apd-input').value = 'countdown'
  const send = ui.querySelector('.apd-send')
  env.dispatch(send, 'click')
  await env.flush()
  assert.equal(send.textContent, '1')
  assert.equal([...env.timers.values()][0].delay, 1000)
  env.timeout()
  assert.equal(send.textContent, '0')
  assert.equal(send.classList.contains('apd-lock'), true)
  env.timeout()
  assert.equal(send.textContent, '\u53D1\u9001')
  assert.equal(send.classList.contains('apd-lock'), false)
  assert.equal(env.timers.size, 0)
  env.destroy()
})

for (const first of ['older', 'newer']) {
  test(`Danmuku Setting ${candidate.name}: shared mount restores remaining owner and original host data when ${first} owner is destroyed first`, () => {
    const env = danmukuSettingEnvironment(candidate)
    const external = env.query('#external')
    external.dataset.danmukuMode = 'host mode'
    env.art.template.$controlsCenter.style.display = 'grid'
    const peer = env.createPeer()
    peer.art.template.$controlsCenter.style.display = 'block'
    env.factory({ danmuku: [], mount: '#external', mode: 0 })(env.art)
    env.factory({ danmuku: [], mount: '#external', mode: 2 })(peer.art)
    assert.equal(external.dataset.danmukuMode, '2')
    assert.equal(external.querySelectorAll('.artplayer-plugin-danmuku').length, 2)
    if (first === 'older') {
      env.destroy()
      assert.equal(external.dataset.danmukuMode, '2')
      peer.destroy()
    }
    else {
      peer.destroy()
      assert.equal(external.dataset.danmukuMode, '0')
      env.destroy()
    }
    assert.equal(external.dataset.danmukuMode, 'host mode')
    assert.equal(external.hasAttribute('data-danmuku-visible'), false)
    assert.equal(external.querySelectorAll('.artplayer-plugin-danmuku').length, 0)
    assert.equal(env.art.template.$controlsCenter.style.display, 'grid')
    assert.equal(peer.art.template.$controlsCenter.style.display, 'block')
    assert.equal(env.query('#unrelated').textContent, 'Keep me')
  })
}

test(`Danmuku Setting ${candidate.name}: destroy preserves host dataset and display values changed after initialization`, () => {
  const env = danmukuSettingEnvironment(candidate)
  const external = env.query('#external')
  external.dataset.danmukuMode = 'original host value'
  external.dataset.getPropertyPriority = 'a host data attribute, not a method'
  env.factory({ danmuku: [], mount: '#external' })(env.art)
  external.dataset.danmukuMode = 'new host value'
  external.dataset.danmukuVisible = 'host visibility'
  env.art.template.$controlsCenter.style.display = 'inline-grid'
  env.destroy()
  assert.equal(external.dataset.danmukuMode, 'new host value')
  assert.equal(external.dataset.danmukuVisible, 'host visibility')
  assert.equal(env.art.template.$controlsCenter.style.display, 'inline-grid')
  assert.equal(external.hasAttribute('data-danmuku-color'), false)
  assert.equal(external.dataset.getPropertyPriority, 'a host data attribute, not a method')
})

test(`Danmuku Setting ${candidate.name}: a disposer failure preserves the original initialization error and cleans other resources`, () => {
  const env = danmukuSettingEnvironment(candidate)
  const proxy = env.art.proxy
  const cleanupError = new Error('one proxy disposer failed')
  let shouldThrow = true
  env.art.proxy = (...args) => {
    const dispose = proxy(...args)
    return () => {
      dispose()
      if (shouldThrow) {
        shouldThrow = false
        throw cleanupError
      }
    }
  }
  assert.throws(() => env.factory({ danmuku: [], mount: '#missing' })(env.art), /Can not find the mount point: #missing/u)
  assert.equal(env.proxyCount(), 0)
  assert.equal(env.listenerCount(), 0)
  assert.ok(env.workers.every(worker => worker.terminated))
  assert.ok(env.consoleWarnings.some(args => args.includes(cleanupError)))
})

test(`Danmuku Setting ${candidate.name}: synchronous destroy during proxy registration leaves an inert mount facade`, () => {
  const env = danmukuSettingEnvironment(candidate)
  const proxy = env.art.proxy
  let first = true
  env.art.proxy = (...args) => {
    const dispose = proxy(...args)
    if (first) {
      first = false
      env.destroy()
    }
    return dispose
  }
  const plugin = env.factory({ danmuku: [], mount: '#external' })(env.art)
  assert.equal(plugin.mount('#second'), undefined)
  assert.equal(env.document.querySelectorAll('.artplayer-plugin-danmuku').length, 0)
  assert.equal(env.proxyCount(), 0)
  assert.equal(env.listenerCount(), 0)
  assert.equal(env.timers.size, 0)
  assert.ok(env.workers.every(worker => worker.terminated))
})

for (const implementation of historical) {
  test(`Danmuku Setting historical defect ${implementation.name}: destroy retains external UI, subscriptions, proxies and lock timer`, async () => {
    const { env, ui } = fixture(implementation)
    ui.querySelector('.apd-input').value = 'historical lock'
    env.dispatch(ui.querySelector('.apd-send'), 'click')
    await env.flush()
    env.destroy()
    assert.equal(ui.parentElement.id, 'external')
    assert.ok(env.listenerCount() > 0)
    assert.ok(env.proxyCount() > 0)
    assert.equal(env.timers.size, 1)
  })

  test(`Danmuku Setting historical defect ${implementation.name}: late beforeEmit still clears input and locks after destroy`, async () => {
    const gate = deferred()
    const { env, ui } = fixture(implementation, { beforeEmit: () => gate.promise })
    ui.querySelector('.apd-input').value = 'historical pending'
    env.dispatch(ui.querySelector('.apd-send'), 'click')
    env.destroy()
    gate.resolve(true)
    await env.flush()
    assert.equal(ui.querySelector('.apd-input').value, '')
    assert.equal(env.timers.size, 1)
    assert.equal(ui.querySelector('.apd-send').classList.contains('apd-lock'), true)
  })
}
