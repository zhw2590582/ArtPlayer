import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { iframeCandidate, iframeHistorical } from '../helpers/iframe.js'
import { expect, test } from './fixtures.js'

const candidate = await iframeCandidate()
const old = (await iframeHistorical()).filter(item => ['published-artplayer-plugin-iframe.js', 'workspace.js'].includes(item.name))
const cases = ['same-origin', 'cross-origin', 'opaque-origin', 'redirect'].flatMap(relation => ['parent-guard', 'child-guard', 'malformed'].map(scenario => ({ relation, scenario, parent: candidate, child: candidate })))
if (process.env.ARTPLAYER_IFRAME_BOUNDARIES_ONLY !== '1') {
  for (const historical of old) {
    for (const relation of ['same-origin', 'cross-origin']) {
      cases.push({ relation, scenario: 'mixed-parent', parent: candidate, child: historical })
      cases.push({ relation, scenario: 'mixed-child', parent: historical, child: candidate })
    }
  }
}

for (const item of cases) {
  test(`Iframe boundary ${item.relation}/${item.scenario}/${item.parent.name}/${item.child.name}`, async ({ page }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    const parentOrigin = new URL(page.url()).origin
    const alternate = parentOrigin.replace('127.0.0.1', 'localhost')
    const childOrigin = ['cross-origin', 'redirect'].includes(item.relation) ? alternate : parentOrigin
    const eventOrigin = item.relation === 'opaque-origin' ? 'null' : childOrigin
    const query = `?auto=${item.scenario === 'parent-guard' ? '0' : '1'}&global=${item.child.global}`
    const childUrl = `${childOrigin}/test/iframe-boundary-child.html${query}`
    const initialUrl = item.relation === 'redirect' ? `${parentOrigin}/test/iframe-boundary-redirect${query}` : childUrl
    const redirects = []
    page.on('response', (response) => {
      if (response.url() === initialUrl && response.status() === 302)
        redirects.push({ url: response.url(), status: response.status(), location: response.headers().location })
    })
    await page.route('**/iframe-boundary-lib.js', route => route.fulfill({ contentType: 'text/javascript', body: item.child.code }))
    await page.route('**/iframe-boundary-foreign', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><script>parent.postMessage({type:"foreign-ready"},"*")</script>' }))
    await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${item.parent.code}; window.IframeFactory = module.exports.default || module.exports; })();` })
    await page.evaluate(({ initialUrl, opaque }) => {
      window.packets = []
      window.states = {}
      window.callbacks = []
      const frame = document.createElement('iframe')
      if (opaque)
        frame.sandbox = 'allow-scripts'
      frame.id = 'boundary-target'
      document.body.append(frame)
      window.targetFrame = frame
      addEventListener('message', event => window.packets.push({ type: event.data?.type, data: event.data?.data, id: event.data?.id, fromChild: event.source === frame.contentWindow, origin: event.origin }))
      window.tool = new window.IframeFactory({ iframe: frame, url: initialUrl })
      window.tool.message(packet => window.callbacks.push(packet))
      window.track = (key, promise) => {
        window.states[key] = { status: 'pending' }
        promise.then(value => window.states[key] = { status: 'resolved', value }, error => window.states[key] = { status: 'rejected', error: error.message })
      }
    }, { initialUrl, opaque: item.relation === 'opaque-origin' })
    let result
    try {
      await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'fixture-ready'))).toBe(true)
      const child = page.frames().find(frame => frame.url() === childUrl)
      expect(child, 'actual child document after any redirect').toBeTruthy()
      if (item.relation === 'redirect')
        expect(redirects).toEqual([{ url: initialUrl, status: 302, location: childUrl }])
      if (item.scenario === 'parent-guard' || item.scenario === 'child-guard') {
        await page.evaluate((url) => {
          const frame = document.createElement('iframe')
          frame.src = url
          document.body.append(frame)
        }, `${alternate}/iframe-boundary-foreign`)
        await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'foreign-ready'))).toBe(true)
        const foreign = page.frames().find(frame => frame.url().endsWith('/iframe-boundary-foreign'))
        if (item.scenario === 'parent-guard') {
          await foreign.evaluate(() => parent.postMessage({ type: 'inject', data: 'forged handshake' }, '*'))
          await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.data === 'forged handshake'))).toBe(true)
          expect(await page.evaluate(() => window.tool.injected)).toBe(false)
          expect(await page.evaluate(() => window.callbacks.some(packet => packet.data === 'forged handshake'))).toBe(false)
          await child.evaluate(() => window.Tool.inject())
          await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
          const id = await page.evaluate(() => {
            window.track('held', window.tool.postMessage({ type: 'hold' }))
            return Number(Object.keys(window.tool.promises)[0])
          })
          await expect.poll(() => child.evaluate(() => Boolean(window.held))).toBe(true)
          await foreign.evaluate(id => parent.postMessage({ type: 'custom-result', data: 'forged response', id }, '*'), id)
          await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.data === 'forged response'))).toBe(true)
          expect(await page.evaluate(() => window.states.held.status)).toBe('pending')
          expect(await page.evaluate(() => window.callbacks.some(packet => packet.data === 'forged response'))).toBe(false)
          await child.evaluate(() => window.Tool.postMessage({ type: 'custom-result', data: 'real response', id: window.held.id }))
          await expect.poll(() => page.evaluate(() => window.states.held.status)).toBe('resolved')
          result = await page.evaluate(() => ({ state: window.states.held, pending: Object.keys(window.tool.promises).length, rejectedOrigins: window.packets.filter(packet => packet.data === 'forged handshake' || packet.data === 'forged response').map(packet => ({ origin: packet.origin, fromChild: packet.fromChild })) }))
          expect(result.state).toEqual({ status: 'resolved', value: 'real response' })
          expect(result.pending).toBe(0)
          expect(result.rejectedOrigins).toEqual([{ origin: alternate, fromChild: false }, { origin: alternate, fromChild: false }])
        }
        else {
          await foreign.evaluate(() => parent.frames[0].postMessage({ type: 'commit', data: 'window.executions++; return "foreign executed"', id: 999 }, '*'))
          await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'fixture-observed' && packet.data.id === 999))).toBe(true)
          expect(await child.evaluate(() => window.executions)).toBe(0)
          expect(await page.evaluate(() => window.packets.some(packet => packet.data === 'foreign executed'))).toBe(false)
          const value = await page.evaluate(() => window.tool.commit(() => {
            window.executions++
            return 11
          }))
          expect(value).toBe(11)
          result = await child.evaluate(() => ({ executions: window.executions, foreignCommit: window.received.find(packet => packet.id === 999) }))
          expect(result.executions).toBe(1)
          expect(result.foreignCommit.fromParent).toBe(false)
          expect(result.foreignCommit.origin).toBe(alternate)
        }
      }
      else if (item.scenario === 'malformed') {
        await child.evaluate(() => {
          for (const payload of [null, false, 3, 'packet', {}, { type: 3 }])
            parent.postMessage(payload, '*')
          parent.postMessage({ type: 'fixture-malformed-complete' }, '*')
        })
        await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'fixture-malformed-complete'))).toBe(true)
        await page.evaluate(() => {
          for (const payload of [null, false, 3, 'packet', {}, { type: 3 }])
            window.targetFrame.contentWindow.postMessage(payload, '*')
        })
        await expect.poll(() => child.evaluate(() => window.received.filter(packet => !packet.internal).length)).toBe(6)
        const value = await page.evaluate(() => window.tool.commit(() => {
          return 12
        }))
        expect(value).toBe(12)
        result = await page.evaluate(() => ({ invalidCallbacks: window.callbacks.filter(packet => typeof packet.type !== 'string').length, pending: Object.keys(window.tool.promises).length }))
        expect(result).toEqual({ invalidCallbacks: 0, pending: 0 })
      }
      else {
        await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
        result = await page.evaluate(async () => {
          const sync = await window.tool.commit(() => {
            return 14
          })
          const async = await window.tool.commit((resolve) => {
            setTimeout(() => resolve(15), 5)
          })
          return { sync, async, pending: Object.keys(window.tool.promises).length }
        })
        expect(result).toEqual({ sync: 14, async: 15, pending: 0 })
      }
      const packets = await page.evaluate(() => window.packets)
      expect(packets.filter(packet => packet.fromChild).every(packet => packet.origin === eventOrigin)).toBe(true)
      await testInfo.attach('iframe-boundary', { contentType: 'application/json', body: JSON.stringify({ relation: item.relation, scenario: item.scenario, parent: { name: item.parent.name, sha256: hash(item.parent.code) }, child: { name: item.child.name, sha256: hash(item.child.code) }, parentOrigin, initialUrl, childUrl, eventOrigin, redirects, result, packets, scope: 'Actual window peers and native source/origin. Redirect is an HTTP 302 from the local test server; opaque peer is sandbox allow-scripts. Mixed-version rows cover normal wire compatibility only, not security of an unchanged historical peer. No player/media integration.' }) })
    }
    finally {
      await page.evaluate(() => {
        window.tool.destroy()
        document.querySelectorAll('iframe').forEach(frame => frame.remove())
      })
    }
  })
}
