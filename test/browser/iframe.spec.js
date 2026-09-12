import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { iframeCandidate, iframeHistorical } from '../helpers/iframe.js'
import { expect, test } from './fixtures.js'

const candidate = { ...await iframeCandidate(), lifecycle: true }
const implementations = process.env.ARTPLAYER_IFRAME_LIFECYCLE_ONLY === '1'
  ? [candidate]
  : [...(await iframeHistorical()).filter(item => item.global !== 'ArtplayerHelperIframe'), candidate]

for (const implementation of implementations) {
  for (const relation of ['same-origin', 'cross-origin']) {
    const scenarios = implementation.lifecycle
      ? ['round-trip', 'same-tick', 'destroy-pending', 'destroy-wait', 'clone-failure']
      : ['round-trip', 'same-tick', 'destroy-pending', 'foreign-message', 'navigation', 'clone-failure']
    for (const scenario of scenarios) {
      test(`Iframe ${implementation.name}/${relation}: ${scenario} ${implementation.lifecycle ? 'lifecycle acceptance' : 'historical behavior'}`, async ({ page }, testInfo) => {
        await page.goto('/test/player.html?core=published')
        const parentOrigin = new URL(page.url()).origin
        const alternate = parentOrigin.replace('127.0.0.1', 'localhost')
        const childOrigin = relation === 'same-origin' ? parentOrigin : alternate
        const foreignOrigin = relation === 'same-origin' ? alternate : parentOrigin
        await page.route('**/iframe-baseline-lib.js', route => route.fulfill({ contentType: 'text/javascript', body: implementation.code }))
        await page.route('**/iframe-baseline-child?*', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><script src="/iframe-baseline-lib.js"></script><script>
          window.Tool = window.${implementation.global}; window.received = []; window.expectedErrors = [];
          addEventListener('unhandledrejection', event => {
            if (event.reason?.message === 'iframe baseline expected error') {
              expectedErrors.push(event.reason.message); event.preventDefault();
            }
          });
          addEventListener('message', event => {
            received.push({ type: event.data?.type, id: event.data?.id, fromParent: event.source === parent, origin: event.origin });
            if (event.data?.type === 'hold') {
              window.held = event.data;
              parent.postMessage({ type: 'fixture-held', data: held.id }, '*');
            }
          });
          if (new URL(location.href).searchParams.get('auto') !== '0') Tool.inject();
          parent.postMessage({ type: 'fixture-ready', data: location.search }, '*');
        </script>` }))
        await page.route('**/iframe-baseline-foreign', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><script>parent.postMessage({type:"inject",data:"foreign"},"*")</script>' }))
        await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.IframeFactory = module.exports.default || module.exports; })();` })
        const manualInjection = scenario === 'foreign-message' || scenario === 'clone-failure' || scenario === 'destroy-wait'
        const url = `${childOrigin}/iframe-baseline-child?auto=${manualInjection ? 0 : 1}&epoch=1`
        await page.evaluate((url) => {
          window.packets = []
          window.states = {}
          const frame = document.createElement('iframe')
          frame.id = 'target-frame'
          document.body.append(frame)
          window.targetFrame = frame
          window.addEventListener('message', event => window.packets.push({ type: event.data?.type, data: event.data?.data, id: event.data?.id, origin: event.origin, fromChild: event.source === frame.contentWindow }))
          window.tool = new window.IframeFactory({ iframe: frame, url })
          window.track = (key, promise) => {
            window.states[key] = { status: 'pending' }
            promise.then(value => window.states[key] = { status: 'resolved', value }, error => window.states[key] = { status: 'rejected', error: error.message })
          }
        }, url)
        let result
        try {
          await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'fixture-ready'))).toBe(true)
          if (!manualInjection)
            await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
          if (scenario === 'round-trip') {
            result = await page.evaluate(async () => {
              const sync = await window.tool.commit(() => {
                return 7
              })
              const async = await window.tool.commit((resolve) => {
                setTimeout(() => resolve(8), 10)
              })
              let error
              try {
                await window.tool.commit(() => {
                  throw new Error('iframe baseline expected error')
                })
              }
              catch (failure) { error = failure.message }
              const recovery = await window.tool.commit(() => {
                return 9
              })
              return { sync, async, error, recovery, pending: Object.keys(window.tool.promises).length }
            })
            expect(result).toEqual({ sync: 7, async: 8, error: 'iframe baseline expected error', recovery: 9, pending: 0 })
          }
          else if (scenario === 'same-tick') {
            await page.evaluate(() => {
              const now = Date.now
              Date.now = () => 1234
              try {
                window.track('first', window.tool.commit(() => {
                  return 1
                }))
                window.track('second', window.tool.commit(() => {
                  return 2
                }))
              }
              finally { Date.now = now }
            })
            await expect.poll(() => page.evaluate(() => window.packets.filter(packet => packet.type === 'response').length)).toBe(2)
            result = await page.evaluate(() => ({ states: window.states, pending: Object.keys(window.tool.promises).length }))
            expect(result).toEqual(implementation.lifecycle
              ? { states: { first: { status: 'resolved', value: 1 }, second: { status: 'resolved', value: 2 } }, pending: 0 }
              : { states: { first: { status: 'pending' }, second: { status: 'resolved', value: 1 } }, pending: 0 })
          }
          else if (scenario === 'destroy-pending') {
            await page.evaluate(() => window.track('held', window.tool.postMessage({ type: 'hold' })))
            await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'fixture-held'))).toBe(true)
            await page.evaluate(() => window.tool.destroy())
            const child = page.frames().find(frame => frame.url() === url)
            await child.evaluate(() => window.Tool.postMessage({ type: 'response', data: 'late', id: window.held.id }))
            await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'response' && packet.data === 'late'))).toBe(true)
            result = await page.evaluate(() => ({ destroyed: window.tool.destroyed, state: window.states.held, pending: Object.keys(window.tool.promises).length }))
            expect(result).toEqual(implementation.lifecycle
              ? { destroyed: true, state: { status: 'rejected', error: 'The instance has been destroyed' }, pending: 0 }
              : { destroyed: true, state: { status: 'pending' }, pending: 1 })
          }
          else if (scenario === 'destroy-wait') {
            result = await page.evaluate(async () => {
              window.track('waiting', window.tool.postMessage({ type: 'hold' }))
              window.tool.destroy()
              await Promise.resolve()
              return { state: window.states.waiting, pending: Object.keys(window.tool.promises).length }
            })
            expect(result).toEqual({ state: { status: 'rejected', error: 'The instance has been destroyed' }, pending: 0 })
            const child = page.frames().find(frame => frame.url() === url)
            await child.evaluate(() => window.Tool.inject())
            await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'inject'))).toBe(true)
            expect(await page.evaluate(() => window.tool.injected)).toBe(false)
          }
          else if (scenario === 'foreign-message') {
            expect(await page.evaluate(() => window.tool.injected)).toBe(false)
            await page.evaluate((url) => {
              const frame = document.createElement('iframe')
              frame.id = 'foreign-frame'
              frame.src = url
              document.body.append(frame)
            }, `${foreignOrigin}/iframe-baseline-foreign`)
            await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
            const id = await page.evaluate(() => {
              window.track('foreign', window.tool.postMessage({ type: 'hold' }))
              return Number(Object.keys(window.tool.promises)[0])
            })
            const foreign = page.frames().find(frame => frame.url().endsWith('/iframe-baseline-foreign'))
            await foreign.evaluate(id => parent.postMessage({ type: 'response', data: 'foreign response', id }, '*'), id)
            await expect.poll(() => page.evaluate(() => window.states.foreign.status)).toBe('resolved')
            const child = page.frames().find(frame => frame.url() === url)
            await child.evaluate(() => window.Tool.inject())
            await foreign.evaluate(() => parent.frames[0].postMessage({ type: 'commit', data: 'return "foreign command"', id: 17 }, '*'))
            await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'response' && packet.data === 'foreign command'))).toBe(true)
            result = await page.evaluate(() => ({ state: window.states.foreign, foreignResponse: window.packets.find(packet => packet.data === 'foreign response') }))
            expect(result.state).toEqual({ status: 'resolved', value: 'foreign response' })
            expect(result.foreignResponse.fromChild).toBe(false)
            expect(result.foreignResponse.origin).toBe(foreignOrigin)
            expect(await child.evaluate(() => window.received.some(packet => packet.type === 'commit' && !packet.fromParent))).toBe(true)
          }
          else if (scenario === 'clone-failure') {
            await page.evaluate(() => {
              window.cloneErrors = []
              window.addEventListener('error', (event) => {
                if (event.error?.name === 'DataCloneError') {
                  window.cloneErrors.push(event.error.name)
                  event.preventDefault()
                }
              })
              window.track('deferredClone', window.tool.postMessage({ type: 'query', data: () => 'not cloneable' }))
            })
            const child = page.frames().find(frame => frame.url() === url)
            await child.evaluate(() => window.Tool.inject())
            if (implementation.lifecycle)
              await expect.poll(() => page.evaluate(() => window.states.deferredClone.status)).toBe('rejected')
            else
              await expect.poll(() => page.evaluate(() => window.cloneErrors.length)).toBe(1)
            result = await page.evaluate(async () => {
              const deferredId = Object.keys(window.tool.promises)[0] || Date.now()
              const now = Date.now
              Date.now = () => Number(deferredId) + 1
              let failure
              try {
                await window.tool.postMessage({ type: 'query', data: () => 'also not cloneable' })
              }
              catch (error) { failure = error.name }
              finally { Date.now = now }
              return { failure, deferred: window.states.deferredClone, pending: Object.keys(window.tool.promises).length, uncaught: window.cloneErrors }
            })
            if (implementation.lifecycle) {
              expect(result.failure).toBe('DataCloneError')
              expect(result.deferred.status).toBe('rejected')
              expect(result.deferred.error).toMatch(/clon/i)
              expect(result.pending).toBe(0)
              expect(result.uncaught).toEqual([])
            }
            else {
              expect(result).toEqual({ failure: 'DataCloneError', deferred: { status: 'pending' }, pending: 2, uncaught: ['DataCloneError'] })
            }
          }
          else {
            const nextUrl = `${childOrigin}/iframe-baseline-child?auto=0&epoch=2`
            await page.evaluate(url => window.targetFrame.src = url, nextUrl)
            await expect.poll(() => page.evaluate(() => window.packets.some(packet => packet.type === 'fixture-ready' && packet.data.includes('epoch=2')))).toBe(true)
            await page.evaluate(() => window.track('navigation', window.tool.commit(() => {
              return 9
            })))
            const child = page.frames().find(frame => frame.url() === nextUrl)
            await expect.poll(() => child.evaluate(() => window.received.some(packet => packet.type === 'commit'))).toBe(true)
            await child.evaluate(() => window.Tool.inject())
            const recovery = await page.evaluate(() => window.tool.commit(() => {
              return 10
            }))
            result = await page.evaluate(() => ({ injected: window.tool.injected, state: window.states.navigation, pending: Object.keys(window.tool.promises).length }))
            expect(result).toEqual({ injected: true, state: { status: 'pending' }, pending: 1 })
            expect(recovery).toBe(10)
          }
          const packets = await page.evaluate(() => window.packets)
          expect(packets.filter(packet => packet.fromChild).every(packet => packet.origin === childOrigin)).toBe(true)
          await testInfo.attach('iframe-behavior', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), relation, scenario, parentOrigin, childOrigin, foreignOrigin, result, packets, lifecycleAcceptance: Boolean(implementation.lifecycle), scope: 'Actual browser iframe WindowProxy/source/origin and postMessage. Local route fulfills immutable library bytes. Date.now is controlled for collision and distinct clone-failure IDs. Only the deliberate child error/DataCloneError is intercepted. Historical defects are asserted for historical rows; lifecycle acceptance requires cleanup and absence of uncaught clone errors. Navigation and trust are not candidate acceptance yet.' }) })
        }
        finally {
          await page.evaluate(() => {
            window.tool.destroy()
            document.querySelectorAll('iframe').forEach(frame => frame.remove())
          })
        }
      })
    }
  }
}
