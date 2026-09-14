import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

let candidate
let provenance
test.beforeAll(async () => {
  ;({ code: candidate, provenance } = await browserCandidate('artplayer-plugin-danmuku', process.env.ARTPLAYER_DANMUKU_ARTIFACT))
})

test.beforeEach(async ({ browserName }, testInfo) => {
  await testInfo.attach('danmuku-selected-input', { contentType: 'application/json', body: JSON.stringify({ browserName, provenance }) })
})

async function setup(page, core, scenario, testInfo) {
  const origin = new URL(testInfo.project.use.baseURL).origin
  await page.route('**/*', (route) => {
    return new URL(route.request().url()).origin === origin ? route.continue() : route.abort()
  })
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: candidate })
  await page.evaluate(({ scenario }) => {
    window.resourcePlayers = []
    window.resourcePlugins = []
    window.resourceOwners = []
    window.resourceMessages = []
    window.resourceSends = []
    window.resourceErrors = []
    window.resourceWorkers = []
    window.resourceTimers = new Set()
    const nativeSetTimeout = window.setTimeout.bind(window)
    const nativeClearTimeout = window.clearTimeout.bind(window)
    window.setTimeout = (callback, delay, ...args) => {
      const id = nativeSetTimeout(() => {
        window.resourceTimers.delete(id)
        callback(...args)
      }, delay)
      if (window.captureNextResourceTimer && delay === 1000) {
        window.resourceTimers.add(id)
        window.captureNextResourceTimer = false
      }
      return id
    }
    window.clearTimeout = (id) => {
      window.resourceTimers.delete(id)
      nativeClearTimeout(id)
    }
    const NativeWorker = window.Worker
    window.Worker = class extends NativeWorker {
      constructor(...args) {
        super(...args)
        this.record = { terminated: 0 }
        window.resourceWorkers.push(this.record)
      }

      terminate() {
        this.record.terminated++
        super.terminate()
      }
    }
    const originalError = console.error
    console.error = (...args) => {
      window.resourceErrors.push(args.map(arg => arg?.message || String(arg)))
      originalError(...args)
    }
    window.sendGate = new Promise((resolve, reject) => {
      window.resolveSend = resolve
      window.rejectSend = reject
    })
    window.createResourcePlayer = (index, extra = {}) => {
      const container = index === 0 ? document.querySelector('.player') : document.body.appendChild(document.createElement('div'))
      container.style.cssText = 'width:640px;height:360px'
      const mount = document.body.appendChild(document.createElement('div'))
      mount.id = `resource-mount-${index}`
      const art = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true, fullscreenWeb: true, setting: true })
      window.resourcePlayers[index] = art
      art.on('artplayerPluginDanmuku:visible', item => window.resourceMessages.push(item.text))
      const option = {
        danmuku: [],
        mount,
        heatmap: scenario === 'heatmap' ? { sampling: 0 } : false,
        lockTime: 10,
        margin: [10, 10],
        fontSize: 20,
        speed: 2,
        beforeEmit(danmu) {
          window.resourceSends.push({ index, text: danmu.text, receiver: this === window.resourcePlugins[index].option })
          // Capture the lock scheduled in this send's await continuation, not
          // unrelated browser/core one-second timers while typing or clicking.
          if (window.observeResourceTimers)
            window.captureNextResourceTimer = true
          return scenario === 'pending' || scenario === 'reject' ? window.sendGate : true
        },
        ...extra,
      }
      art.plugins.add(window.artplayerPluginDanmuku(option))
      const plugin = art.plugins.artplayerPluginDanmuku
      window.resourcePlugins[index] = plugin
      window.resourceOwners[index] = plugin.show()
      return art
    }
    window.art = window.createResourcePlayer(0)
    document.querySelector('#play').onclick = () => window.art.play()
  }, { scenario })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await testInfo.attach('danmuku-resources-inputs', { contentType: 'application/json', body: JSON.stringify({ core, scenario, artifact: provenance.file || provenance.kind, sha256: hash(candidate), native: 'video, RAF, DOM, Worker; observe the first one-second timer after beforeEmit in the synchronous send continuation, no fake timer clock' }) })
}

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('danmuku-resources-page', { contentType: 'image/png', body: await page.screenshot() })
  const evidence = await page.evaluate(() => {
    for (const art of window.resourcePlayers || []) {
      if (!art.isDestroy)
        art.destroy(false)
    }
    return { workers: window.resourceWorkers, sends: window.resourceSends, messages: window.resourceMessages, errors: window.resourceErrors, retainedSettings: document.querySelectorAll('[id^="resource-mount-"] .artplayer-plugin-danmuku').length, timers: window.resourceTimers?.size }
  })
  await testInfo.attach('danmuku-resources-evidence', { contentType: 'application/json', body: JSON.stringify(evidence) })
  expect(evidence.retainedSettings).toBe(0)
  for (const worker of evidence.workers || []) expect(worker.terminated).toBe(1)
})

async function renderResourceRow(page, text) {
  await page.evaluate(async (text) => {
    const owner = await window.resourcePlugins[0].emit({ text, time: 0.2, mode: 1 })
    // Resource tests start with an eligible row, then require a real Worker and
    // rendered DOM. Native timestamp delivery is covered by the scheduler spec.
    owner.setState(owner.queue[owner.queue.length - 1], 'ready')
  }, text)
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.resourceMessages)).toContain(text)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: shared setting mount preserves the surviving instance and later user changes`, async ({ page }, testInfo) => {
    await setup(page, core, 'normal', testInfo)
    const result = await page.evaluate(() => {
      const mount = document.querySelector('#resource-mount-0')
      window.createResourcePlayer(1, { mount, theme: 'light' })
      window.art.destroy(false)
      const survivor = { panels: mount.querySelectorAll('.artplayer-plugin-danmuku').length, theme: mount.dataset.danmukuTheme }
      mount.dataset.danmukuTheme = 'user-value'
      window.resourcePlayers[1].destroy(false)
      return { survivor, theme: mount.dataset.danmukuTheme, ownedKeys: Object.keys(mount.dataset).filter(key => key.startsWith('danmuku') && key !== 'danmukuTheme'), panels: mount.querySelectorAll('.artplayer-plugin-danmuku').length }
    })
    expect(result).toEqual({ survivor: { panels: 1, theme: 'light' }, theme: 'user-value', ownedKeys: [], panels: 0 })
  })

  test(`${core}: invalid setting mount rolls back plugin resources while preserving the original error`, async ({ page }, testInfo) => {
    await setup(page, core, 'normal', testInfo)
    const result = await page.evaluate(() => {
      const container = document.body.appendChild(document.createElement('div'))
      container.style.cssText = 'width:640px;height:360px'
      const art = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true })
      window.resourcePlayers.push(art)
      art.template.$controlsCenter.style.setProperty('display', 'grid', 'important')
      const display = art.template.$controlsCenter.style.display
      let error
      try {
        art.plugins.add(window.artplayerPluginDanmuku({ danmuku: [], mount: '#missing-setting-mount' }))
      }
      catch (failure) {
        error = failure.message
      }
      return { error, panels: container.querySelectorAll('.artplayer-plugin-danmuku').length, worker: window.resourceWorkers.at(-1), display: art.template.$controlsCenter.style.display, priority: art.template.$controlsCenter.style.getPropertyPriority('display'), previousDisplay: display }
    })
    expect(result.error).toContain('Can not find the mount point: #missing-setting-mount')
    expect(result.panels).toBe(0)
    expect(result.worker.terminated).toBe(1)
    expect(result.display).toBe(result.previousDisplay)
    expect(result.priority).toBe('important')
  })

  test(`${core}: destroy cancels pending setting send without clearing retained input or starting a lock`, async ({ page }, testInfo) => {
    await setup(page, core, 'pending', testInfo)
    const mount = page.locator('#resource-mount-0')
    await mount.locator('.apd-input').fill('PENDING')
    await mount.locator('.apd-send').click()
    expect(await page.evaluate(() => window.resourceSends)).toEqual([{ index: 0, text: 'PENDING', receiver: true }])
    const result = await page.evaluate(async () => {
      const input = document.querySelector('#resource-mount-0 .apd-input')
      const send = document.querySelector('#resource-mount-0 .apd-send')
      window.art.destroy(false)
      window.resolveSend(true)
      await new Promise(resolve => setTimeout(resolve, 30))
      return { value: input.value, locked: send.classList.contains('apd-lock'), queue: window.resourceOwners[0].queue.map(item => item.text), connected: input.isConnected }
    })
    expect(result).toEqual({ value: 'PENDING', locked: false, queue: [], connected: false })
    expect(await page.evaluate(() => window.resourceErrors)).toEqual([])
  })

  test(`${core}: destroy clears active send timer and leaves another mounted instance usable`, async ({ page }, testInfo) => {
    await setup(page, core, 'normal', testInfo)
    await page.evaluate(() => window.observeResourceTimers = true)
    await page.locator('#resource-mount-0 .apd-input').fill('LOCK')
    await page.locator('#resource-mount-0 .apd-send').click()
    await expect(page.locator('#resource-mount-0 .apd-send')).toHaveClass(/apd-lock/u)
    expect(await page.evaluate(() => window.resourceTimers.size)).toBe(1)
    await page.evaluate(() => {
      window.observeResourceTimers = false
      window.createResourcePlayer(1)
      window.art.destroy(false)
    })
    expect(await page.evaluate(() => window.resourceTimers.size)).toBe(0)
    await expect(page.locator('#resource-mount-0 .artplayer-plugin-danmuku')).toHaveCount(0)
    await page.locator('#resource-mount-1 .apd-input').fill('SECOND')
    await page.locator('#resource-mount-1 .apd-send').click()
    await expect.poll(() => page.evaluate(() => window.resourceOwners[1].queue.map(row => row.text))).toEqual(['SECOND'])
    expect(await page.locator('style#artplayer-plugin-danmuku').count()).toBe(1)
  })

  test(`${core}: rejected setting callback retains input and original console error without an unhandled rejection`, async ({ page }, testInfo) => {
    await setup(page, core, 'reject', testInfo)
    await page.locator('#resource-mount-0 .apd-input').fill('REJECT')
    await page.locator('#resource-mount-0 .apd-send').click()
    await page.evaluate(() => window.rejectSend(new Error('controlled setting rejection')))
    await expect.poll(() => page.evaluate(() => window.resourceErrors)).toEqual([['Error emitting danmuku:', 'controlled setting rejection']])
    await expect(page.locator('#resource-mount-0 .apd-input')).toHaveValue('REJECT')
    await expect(page.locator('#resource-mount-0 .apd-send')).not.toHaveClass(/apd-lock/u)
    expect(await page.evaluate(() => window.resourceOwners[0].queue.length)).toBe(0)
  })

  test(`${core}: destroy false releases actual renderer nodes while retaining the player shell`, async ({ page }, testInfo) => {
    await setup(page, core, 'normal', testInfo)
    await renderResourceRow(page, 'VISIBLE')
    const result = await page.evaluate(() => {
      const layer = window.art.template.$danmuku
      const node = [...layer.children].find(item => item.textContent === 'VISIBLE')
      const owner = window.resourceOwners[0]
      window.art.destroy(false)
      return { connected: node.isConnected, nodes: layer.children.length, refs: owner.$refs.length, dangling: owner.queue.filter(item => item.$ref).length, shell: !!window.art.template.$player }
    })
    expect(result).toEqual({ connected: false, nodes: 0, refs: 0, dangling: 0, shell: true })
  })

  test(`${core}: replacement load removes a moved renderer node and preserves unrelated body content`, async ({ page }, testInfo) => {
    await setup(page, core, 'normal', testInfo)
    await renderResourceRow(page, 'MOVED')
    const result = await page.evaluate(async () => {
      window.art.pause()
      const layer = window.art.template.$danmuku
      const node = [...layer.children].find(item => item.textContent === 'MOVED')
      const foreign = document.createElement('aside')
      document.body.append(node, foreign)
      await window.resourcePlugins[0].load()
      const replacement = { connected: node.isConnected, nodes: layer.childElementCount, foreign: foreign.isConnected, refs: window.resourceOwners[0].$refs.length }
      window.art.destroy(false)
      return { replacement, foreignAfterDestroy: foreign.isConnected }
    })
    expect(result).toEqual({ replacement: { connected: false, nodes: 0, foreign: true, refs: 0 }, foreignAfterDestroy: true })
  })

  test(`${core}: narrow heatmap invalid sampling stays responsive and two instances have independent gradients`, async ({ page }, testInfo) => {
    await setup(page, core, 'heatmap', testInfo)
    // A second evaluation has fresh module counters but shares this document.
    await page.addScriptTag({ content: candidate })
    await page.evaluate(() => {
      window.createResourcePlayer(1)
      const first = window.art.controls.heatmap
      first.style.width = '99px'
      window.art.emit('resize')
    })
    await expect.poll(() => page.evaluate(() => window.resourcePlayers[1].isReady)).toBe(true)
    await expect.poll(() => page.locator('.art-control-heatmap svg').count()).toBe(2)
    const result = await page.evaluate(() => {
      const first = window.resourcePlayers[0].controls.heatmap
      const second = window.resourcePlayers[1].controls.heatmap
      const gradient = node => node.querySelector('linearGradient').id
      window.resourcePlayers[0].emit('artplayerPluginDanmuku:points', [[0, 0], [49, 40], [99, 10]])
      window.resourcePlayers[1].emit('artplayerPluginDanmuku:points', [[0, 20], [300, 0], [640, 35]])
      window.resourcePlayers[0].emit('setBar', 'played', 0.25)
      window.resourcePlayers[1].emit('setBar', 'played', 0.75)
      return {
        ids: [gradient(first), gradient(second)],
        fills: [first.querySelector('path').getAttribute('fill'), second.querySelector('path').getAttribute('fill')],
        offsets: [first.querySelector('#heatmap-start').getAttribute('offset'), second.querySelector('#heatmap-start').getAttribute('offset')],
        validPaths: [first, second].every(node => !/NaN|Infinity/.test(node.querySelector('path').getAttribute('d'))),
      }
    })
    expect(new Set(result.ids).size).toBe(2)
    expect(result.ids[0]).toBe('heatmap-solids')
    expect(result.fills).toEqual(result.ids.map(id => `url(#${id})`))
    expect(result.offsets).toEqual(['25%', '75%'])
    expect(result.validPaths).toBe(true)
    await testInfo.attach('danmuku-resources-heatmap', { contentType: 'application/json', body: JSON.stringify(result) })
    await testInfo.attach('danmuku-heatmap-live-page', { contentType: 'image/png', body: await page.screenshot({ fullPage: true }) })
    await page.evaluate(() => window.art.destroy(false))
    await expect(page.locator('.art-control-heatmap')).toHaveCount(1)
    await page.evaluate(() => window.resourcePlayers[1].emit('resize'))
    await expect(page.locator('.art-control-heatmap svg')).toHaveCount(1)
  })
}
