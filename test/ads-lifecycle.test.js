import assert from 'node:assert/strict'
import { getEventListeners } from 'node:events'
// eslint-disable-next-line test/no-import-node-test -- Controlled lifecycle contracts use Node's runner.
import test from 'node:test'
import { setImmediate as settle } from 'node:timers/promises'
import { adsEnvironment, adsImplementations } from './helpers/ads.js'

const implementations = (await adsImplementations()).filter(item => !item.historical)
const skips = host => host.calls.filter(call => call[0] === 'emit' && call[1] === 'artplayerPluginAds:skip')
const contentPlays = host => host.calls.filter(call => call[0] === 'content.play')

for (const { name, factory } of implementations) {
  test(`${name}: repeated play owns one timer and pause clears all countdown work`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const plugin = factory({ html: 'ad', totalDuration: 3 })(host.art)
    host.start()
    plugin.play()
    plugin.play()
    assert.equal(env.timers.size, 1)
    env.tick(1000)
    assert.equal(host.node('countdown').innerHTML, '2秒')
    plugin.pause()
    assert.equal(env.timers.size, 0)
  })

  test(`${name}: skip clears timers and becomes inert under repeated methods/events`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const plugin = factory({ html: 'ad', totalDuration: 1 })(host.art)
    host.start()
    plugin.skip()
    plugin.skip()
    plugin.play()
    host.visibility(false)
    env.tick(5000)
    assert.equal(env.timers.size, 0)
    assert.equal(skips(host).length, 1)
    assert.equal(contentPlays(host).length, 1)
  })

  test(`${name}: destroy cancels countdown and future public calls never resume content`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const plugin = factory({ html: 'ad', totalDuration: 1 })(host.art)
    host.start()
    host.art.destroy()
    plugin.play()
    plugin.skip()
    env.tick(5000)
    assert.equal(env.timers.size, 0)
    assert.equal(contentPlays(host).length, 0)
    assert.equal(skips(host).length, 0)
  })

  test(`${name}: one factory retains per-instance normalized event payloads`, (t) => {
    const env = adsEnvironment(t)
    const first = env.host()
    const second = env.host()
    const attach = factory({ html: 'shared' })
    const one = attach(first.art)
    first.start()
    attach(second.art)
    second.start()
    one.skip()
    assert.equal(skips(first)[0][2], first.normalized)
    assert.notEqual(skips(first)[0][2], second.normalized)
  })

  test(`${name}: zero threshold close works before the first timer tick`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    factory({ html: 'ad', playDuration: 0 })(host.art)
    host.start()
    host.fire('close', 'click')
    assert.equal(skips(host).length, 1)
    assert.equal(env.timers.size, 0)
  })

  test(`${name}: play before initialization is inert and skip cancels pending preroll`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const plugin = factory({ html: 'ad' })(host.art)
    plugin.play()
    assert.equal(env.timers.size, 0)
    plugin.skip()
    host.start()
    assert.equal(host.node(), undefined)
    assert.equal(skips(host).length, 1)
    assert.equal(contentPlays(host).length, 0)
  })

  test(`${name}: duplicate metadata starts the ad once`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    factory({ video: 'ad.mp4' })(host.art)
    host.start()
    host.fire('video', 'loadedmetadata')
    host.fire('video', 'loadedmetadata')
    assert.equal(env.timers.size, 1)
    assert.equal(host.calls.filter(call => call[0] === 'ad.play').length, 1)
  })

  test(`${name}: core version numbers do not reject hosts providing the required capabilities`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    host.art.constructor.version = '4.5.5'
    factory({ html: 'ad', totalDuration: 2 })(host.art)
    host.start()
    env.tick(1000)
    host.visibility(true)
    env.tick(5000)
    assert.equal(host.node('countdown').innerHTML, '1秒')
    host.visibility(false)
    env.tick(1000)
    assert.equal(skips(host).length, 1)
  })

  test(`${name}: synchronous content-play failure still hides ad and completes exactly once`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const warning = []
    t.mock.method(console, 'warn', (...args) => warning.push(args))
    const plugin = factory({ html: 'ad' })(host.art)
    host.start()
    const error = new Error('Content play failed')
    host.art.play = () => {
      throw error
    }
    assert.doesNotThrow(() => plugin.skip())
    assert.equal(host.node().style.display, 'none')
    assert.equal(skips(host).length, 1)
    assert(warning.some(args => args.includes(error)))
  })

  test(`${name}: destroy during content restoration suppresses subsequent skip dispatch`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const plugin = factory({ html: 'ad' })(host.art)
    host.start()
    host.art.on('play', () => host.art.destroy())
    plugin.skip()
    assert.equal(skips(host).length, 0)
    assert.equal(env.timers.size, 0)
  })

  test(`${name}: metadata emitted by the src setter is observed after listeners are installed`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const append = host.art.constructor.utils.append
    host.art.constructor.utils.append = (...args) => {
      const node = append(...args)
      if (node.tagName === 'VIDEO') {
        let source
        Object.defineProperty(node, 'src', {
          configurable: true,
          get: () => source,
          set(value) {
            source = value
            node.dispatchEvent(new Event('loadedmetadata'))
          },
        })
      }
      return node
    }
    factory({ video: 'cached.mp4' })(host.art)
    host.start()
    assert.equal(env.timers.size, 1)
    assert.equal(host.calls.filter(call => call[0] === 'ad.play').length, 1)
  })

  test(`${name}: rejected ad play restores content once and observes the original error`, async (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const warnings = []
    t.mock.method(console, 'warn', (...args) => warnings.push(args))
    factory({ video: 'ad.mp4' })(host.art)
    host.start()
    const error = new Error('Ad play rejected')
    host.node('video').play = () => Promise.reject(error)
    host.fire('video', 'loadedmetadata')
    await settle()
    assert.equal(skips(host).length, 1)
    assert.equal(contentPlays(host).length, 1)
    assert.equal(env.timers.size, 0)
    assert(warnings.some(args => args.includes(error)))
  })

  test(`${name}: late ad play fulfillment after destroy pauses owned media without restoring content`, async (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    factory({ video: 'ad.mp4' })(host.art)
    host.start()
    let resolve
    const video = host.node('video')
    video.play = () => new Promise((done) => {
      resolve = done
    })
    host.fire('video', 'loadedmetadata')
    host.art.destroy()
    const pauses = host.calls.filter(call => call[0] === 'ad.pause').length
    video.paused = false
    resolve()
    await settle()
    assert.equal(video.paused, true)
    assert.equal(host.calls.filter(call => call[0] === 'ad.pause').length, pauses + 1)
    assert.equal(contentPlays(host).length, 0)
    assert.equal(video.src, undefined)
    assert.equal(host.art.template.$ads, undefined)
  })

  test(`${name}: destroy releases own DOM/document listeners and leaves foreign listeners intact`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    factory({ video: 'ad.mp4' })(host.art)
    host.start()
    const video = host.node('video')
    const foreign = () => {}
    video.addEventListener('loadedmetadata', foreign)
    assert.equal(getEventListeners(video, 'loadedmetadata').length, 2)
    assert.equal(getEventListeners(env.document, 'visibilitychange').length, 1)
    host.art.destroy()
    assert.deepEqual(getEventListeners(video, 'loadedmetadata'), [foreign])
    assert.equal(getEventListeners(video, 'error').length, 0)
    assert.equal(getEventListeners(env.document, 'visibilitychange').length, 0)
    assert.equal(host.node().parentNode, null)
    assert.equal(host.art.template.$ads, undefined)
    host.fire('video', 'loadedmetadata')
    assert.equal(env.timers.size, 0)
  })

  test(`${name}: partial view failure removes owned root and subscriptions before propagating`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const append = host.art.constructor.utils.append
    const error = new Error('View failed')
    host.art.constructor.utils.append = (...args) => {
      if (host.node('loading'))
        throw error
      return append(...args)
    }
    factory({ html: 'ad' })(host.art)
    assert.throws(() => host.start(), candidate => candidate === error)
    assert.equal(host.node().parentNode, null)
    assert.equal(host.art.template.$ads, undefined)
    assert.equal([...host.listeners.values()].flatMap(set => [...set]).length, 0)
    assert.equal(env.timers.size, 0)
  })

  test(`${name}: synchronous destroy during root creation leaves no newly appended overlay`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const append = host.art.constructor.utils.append
    host.art.constructor.utils.append = (...args) => {
      const node = append(...args)
      if (node.className === 'artplayer-plugin-ads')
        host.art.destroy()
      return node
    }
    factory({ html: 'ad' })(host.art)
    host.start()
    assert.equal(host.node().parentNode, null)
    assert.equal(host.art.template.$ads, undefined)
    assert.equal(env.timers.size, 0)
    assert.equal(host.calls.filter(call => call[0] === 'content.pause').length, 0)
  })

  test(`${name}: fullscreen icons follow initial and externally changed state`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    host.art.fullscreen = true
    factory({ html: 'ad' })(host.art)
    host.start()
    assert.equal(host.nodes.get('fullscreenOn').style.display, 'none')
    assert.equal(host.nodes.get('fullscreenOff').style.display, 'inline-flex')
    host.art.fullscreen = false
    host.art.emit('fullscreen', false)
    assert.equal(host.nodes.get('fullscreenOn').style.display, 'inline-flex')
    assert.equal(host.nodes.get('fullscreenOff').style.display, 'none')
  })

  test(`${name}: destroy during ad pause prevents late UI writes and skip notification`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const plugin = factory({ video: 'ad.mp4' })(host.art)
    host.start()
    const video = host.node('video')
    let once = false
    video.pause = () => {
      if (!once) {
        once = true
        host.art.destroy()
      }
    }
    plugin.skip()
    assert.equal(skips(host).length, 0)
    assert.equal(host.node().style.display, undefined)
  })

  test(`${name}: destroy preserves a caller replacement of template.$ads`, (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    factory({ html: 'ad' })(host.art)
    host.start()
    const foreign = {}
    host.art.template.$ads = foreign
    host.art.destroy()
    assert.equal(host.art.template.$ads, foreign)
    assert.equal(host.node().parentNode, null)
  })

  test(`${name}: rejected play after destroy is observed without restoring or reporting cancellation`, async (t) => {
    const env = adsEnvironment(t)
    const host = env.host()
    const warnings = []
    t.mock.method(console, 'warn', (...args) => warnings.push(args))
    factory({ video: 'ad.mp4' })(host.art)
    host.start()
    let reject
    host.node('video').play = () => new Promise((_, fail) => {
      reject = fail
    })
    host.fire('video', 'loadedmetadata')
    host.art.destroy()
    reject(new Error('Cancelled by destruction'))
    await settle()
    assert.equal(warnings.length, 0)
    assert.equal(contentPlays(host).length, 0)
    assert.equal(skips(host).length, 0)
  })
}
