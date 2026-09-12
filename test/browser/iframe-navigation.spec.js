import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { iframeCandidate, iframeHistorical } from '../helpers/iframe.js'
import { expect, test } from './fixtures.js'

const implementation = await iframeCandidate()
const scenarios = ['inject-before-load', 'duplicate-inject', 'attribute-navigation', 'child-navigation', 'rapid-navigation', 'same-source-reload', 'fragment-navigation', 'attribute-fragment', 'stale-packets', 'history-back', 'srcdoc-navigation']
const childHtml = fs.readFileSync(new URL('./iframe-boundary-child.html', import.meta.url), 'utf8')

for (const relation of ['same-origin', 'cross-origin', 'opaque-origin']) {
  for (const scenario of scenarios) {
    test(`Iframe document ${relation}/${scenario}/${implementation.name}`, async ({ page }, testInfo) => {
      await page.goto('/test/player.html?core=published')
      const parentOrigin = new URL(page.url()).origin
      const childOrigin = relation === 'cross-origin' ? parentOrigin.replace('127.0.0.1', 'localhost') : parentOrigin
      const urlFor = (epoch, auto = true) => `${childOrigin}/test/iframe-boundary-child.html?global=${implementation.global}&auto=${auto ? 1 : 0}&epoch=${epoch}`
      const url = urlFor(1) + (scenario === 'inject-before-load' ? '&barrier=1' : '')
      let releaseBarrier
      await page.route('**/iframe-load-barrier.svg', async (route) => {
        await new Promise(resolve => releaseBarrier = resolve)
        await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' })
      })
      await page.route('**/iframe-boundary-lib.js', route => route.fulfill({ contentType: 'text/javascript', body: implementation.code }))
      await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.IframeFactory = module.exports.default || module.exports; })();` })
      await page.evaluate(({ url, opaque }) => {
        window.timeline = []
        window.states = {}
        window.callbacks = []
        const frame = document.createElement('iframe')
        if (opaque)
          frame.sandbox = 'allow-scripts'
        document.body.append(frame)
        window.targetFrame = frame
        frame.addEventListener('load', () => window.timeline.push({ kind: 'load' }))
        addEventListener('message', event => window.timeline.push({ kind: 'message', packet: event.data, fromChild: event.source === frame.contentWindow, origin: event.origin }))
        window.tool = new window.IframeFactory({ iframe: frame, url })
        window.tool.message(packet => window.callbacks.push(packet))
        window.track = (key, promise) => {
          window.states[key] = { status: 'pending' }
          promise.then(value => window.states[key] = { status: 'resolved', value }, error => window.states[key] = { status: 'rejected', error: error.message })
        }
      }, { url: scenario === 'attribute-fragment' && relation === 'same-origin' ? url.replace(parentOrigin, '') : url, opaque: relation === 'opaque-origin' })
      let result
      try {
        await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
        let child = page.frames().find(frame => frame.url() === url)
        const first = await page.evaluate(() => window.timeline.find(item => item.packet?.type === 'inject').packet.__artplayerIframe?.document || 'unmarked')
        if (first !== 'unmarked')
          await expect.poll(() => child.evaluate(() => window.received.some(packet => packet.internal))).toBe(true)
        const witness = await child.evaluate(() => window.documentWitness)
        await page.evaluate(() => window.track('old', window.tool.postMessage({ type: 'hold' })))
        await expect.poll(() => child.evaluate(() => Boolean(window.held))).toBe(true)
        const heldId = await child.evaluate(() => window.held.id)
        if (scenario === 'inject-before-load') {
          await expect.poll(() => Boolean(releaseBarrier)).toBe(true)
          expect(await page.evaluate(() => window.timeline.filter(item => item.kind === 'load').length)).toBe(0)
          releaseBarrier()
          await expect.poll(() => page.evaluate(() => window.timeline.some(item => item.kind === 'load'))).toBe(true)
          expect(await page.evaluate(() => window.states.old.status)).toBe('pending')
          expect(await page.evaluate(() => window.tool.injected)).toBe(true)
          await child.evaluate(() => window.Tool.postMessage({ type: 'response', id: window.held.id, data: 'after load' }))
          await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('resolved')
          result = await page.evaluate(() => ({ state: window.states.old, order: window.timeline.filter(item => item.kind === 'load' || item.packet?.type === 'inject').map(item => item.kind === 'load' ? 'load' : 'inject') }))
          expect(result.order).toEqual(['inject', 'load'])
        }
        else if (scenario === 'duplicate-inject') {
          await child.evaluate(() => {
            window.Tool.inject()
            window.Tool.inject()
          })
          await expect.poll(() => page.evaluate(() => window.timeline.filter(item => item.packet?.type === 'inject').length)).toBe(3)
          expect(await page.evaluate(() => window.states.old.status)).toBe('pending')
          await child.evaluate(() => window.Tool.postMessage({ type: 'response', id: window.held.id, data: 12 }))
          await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('resolved')
          result = await page.evaluate(() => ({ state: window.states.old, documentIds: window.timeline.filter(item => item.packet?.type === 'inject').map(item => item.packet.__artplayerIframe?.document || 'unmarked') }))
          expect(result.documentIds.every(value => value === first)).toBe(true)
        }
        else if (scenario === 'fragment-navigation') {
          await child.evaluate(() => location.hash = 'chapter')
          await expect.poll(() => child.evaluate(() => location.hash)).toBe('#chapter')
          expect(await child.evaluate(() => window.documentWitness)).toBe(witness)
          await child.evaluate(() => window.Tool.postMessage({ type: 'response', id: window.held.id, data: 'same document' }))
          await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('resolved')
          result = await page.evaluate(() => ({ state: window.states.old, injected: window.tool.injected }))
          expect(result.injected).toBe(true)
        }
        else if (scenario === 'attribute-fragment') {
          await child.evaluate(() => location.hash = 'child')
          await page.evaluate(() => window.targetFrame.src = `${window.targetFrame.src.split('#')[0]}#parent`)
          await expect.poll(() => child.evaluate(() => location.hash)).toBe('#parent')
          expect(await child.evaluate(() => window.documentWitness)).toBe(witness)
          expect(await page.evaluate(() => window.states.old.status)).toBe('pending')
          await child.evaluate(() => location.hash = 'child-again')
          await page.evaluate(() => {
            const attribute = window.targetFrame.src
            window.targetFrame.src = attribute
          })
          await expect.poll(() => child.evaluate(() => location.hash)).toBe('#parent')
          expect(await child.evaluate(() => window.documentWitness)).toBe(witness)
          expect(await page.evaluate(() => window.states.old.status)).toBe('pending')
          await child.evaluate(() => window.Tool.postMessage({ type: 'response', id: window.held.id, data: 'attribute fragment' }))
          await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('resolved')
          result = await page.evaluate(() => ({ state: window.states.old, injected: window.tool.injected }))
          expect(result.injected).toBe(true)
        }
        else if (scenario === 'same-source-reload') {
          await page.evaluate(() => {
            const currentSource = window.targetFrame.src
            window.targetFrame.src = currentSource
          })
          await expect.poll(() => page.evaluate(() => window.timeline.filter(item => item.packet?.type === 'inject').length)).toBe(2)
          child = page.frames().find(frame => frame.url() === url)
          expect(await child.evaluate(() => window.documentWitness)).not.toBe(witness)
          await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('rejected')
          result = await page.evaluate(() => ({ state: window.states.old, documentIds: window.timeline.filter(item => item.packet?.type === 'inject').map(item => item.packet.__artplayerIframe.document) }))
          expect(result.documentIds[0]).not.toBe(result.documentIds[1])
        }
        else if (scenario === 'srcdoc-navigation') {
          const html = childHtml.replace('src="/iframe-boundary-lib.js"', `src="${parentOrigin}/iframe-boundary-lib.js"`).replace('new URL(location.href).searchParams', `new URLSearchParams('global=${implementation.global}&auto=0&epoch=srcdoc')`)
          await page.evaluate((html) => {
            window.targetFrame.srcdoc = html
            window.track('srcdoc', window.tool.commit(() => {
              return document.URL
            }))
          }, html)
          await expect.poll(() => page.frames().some(frame => frame.url() === 'about:srcdoc')).toBe(true)
          child = page.frames().find(frame => frame.url() === 'about:srcdoc')
          await expect.poll(() => child.evaluate(() => Boolean(window.Tool))).toBe(true)
          await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('rejected')
          expect(await page.evaluate(() => window.tool.injected)).toBe(false)
          await child.evaluate(() => window.Tool.inject())
          await expect.poll(() => page.evaluate(() => window.states.srcdoc.status)).toBe('resolved')
          expect(await page.evaluate(() => window.states.srcdoc.value)).toBe('about:srcdoc')
          await page.evaluate((url) => {
            window.track('srcdocHeld', window.tool.postMessage({ type: 'hold' }))
            window.targetFrame.src = url
          }, urlFor(2))
          await expect.poll(() => child.evaluate(() => Boolean(window.held))).toBe(true)
          expect(await page.evaluate(() => window.states.srcdocHeld.status)).toBe('pending')
          await page.evaluate(() => window.targetFrame.removeAttribute('srcdoc'))
          await expect.poll(() => page.frames().some(frame => frame.url() === urlFor(2))).toBe(true)
          await expect.poll(() => page.evaluate(() => window.states.srcdocHeld.status)).toBe('rejected')
          const value = await page.evaluate(() => window.tool.commit(() => {
            return new URL(location.href).searchParams.get('epoch')
          }))
          expect(value).toBe('2')
          result = await page.evaluate(() => ({ states: window.states, injected: window.tool.injected, pending: Object.keys(window.tool.promises).length }))
          expect(result.pending).toBe(0)
        }
        else {
          const next = urlFor(scenario === 'rapid-navigation' ? 3 : 2, false)
          if (scenario === 'child-navigation' || scenario === 'history-back') {
            await child.evaluate(url => location.href = url, next)
          }
          else {
            await page.evaluate(({ next, intermediate }) => {
              if (intermediate) {
                window.targetFrame.src = intermediate
                window.track('intermediate', window.tool.commit(() => {
                  return 2
                }))
              }
              window.targetFrame.src = next
              window.track('new', window.tool.commit(() => {
                return new URL(location.href).searchParams.get('epoch')
              }))
            }, { next, intermediate: scenario === 'rapid-navigation' ? urlFor(2, false) : null })
          }
          await expect.poll(() => page.frames().some(frame => frame.url() === next)).toBe(true)
          child = page.frames().find(frame => frame.url() === next)
          await expect.poll(() => child.evaluate(() => Boolean(window.Tool))).toBe(true)
          await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('rejected')
          expect(await page.evaluate(() => window.states.old.error)).toBe('The iframe document has changed')
          expect(await page.evaluate(() => window.tool.injected)).toBe(false)
          if (scenario === 'rapid-navigation')
            expect(await page.evaluate(() => window.states.intermediate.status)).toBe('pending')
          await child.evaluate(() => window.Tool.inject())
          await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
          const current = await page.evaluate(() => window.timeline.filter(item => item.packet?.type === 'inject').at(-1).packet.__artplayerIframe.document)
          expect(current).not.toBe(first)
          if (scenario === 'stale-packets') {
            await child.evaluate(({ document, id }) => parent.postMessage({ type: 'old-notification', data: 'stale', id, __artplayerIframe: { version: 1, document, phase: 'message' } }, '*'), { document: first, id: heldId })
            await expect.poll(() => page.evaluate(() => window.timeline.some(item => item.packet?.type === 'old-notification'))).toBe(true)
            expect(await page.evaluate(() => window.callbacks.some(packet => packet.type === 'old-notification'))).toBe(false)
            await page.evaluate(document => window.targetFrame.contentWindow.postMessage({ type: 'commit', data: 'window.executions++; return 999', id: 999, __artplayerIframe: { version: 1, document, phase: 'message' } }, '*'), first)
            await expect.poll(() => child.evaluate(() => window.received.some(packet => packet.id === 999))).toBe(true)
            expect(await child.evaluate(() => window.executions)).toBe(0)
          }
          if (scenario === 'history-back') {
            const beforeBack = await page.evaluate(() => window.timeline.filter(item => item.packet?.type === 'fixture-pageshow').length)
            await child.evaluate(() => history.back())
            await expect.poll(() => page.evaluate(count => window.timeline.filter(item => item.packet?.type === 'fixture-pageshow').length > count, beforeBack)).toBe(true)
            child = page.frames().find(frame => frame.url() === url)
            await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
            const restored = await child.evaluate(() => ({ witness: window.documentWitness, epoch: new URL(location.href).searchParams.get('epoch') }))
            const pageshow = await page.evaluate(() => window.timeline.filter(item => item.packet?.type === 'fixture-pageshow').at(-1).packet.data)
            expect(restored.epoch).toBe('1')
            if (pageshow.persisted)
              expect(restored.witness).toBe(witness)
            const value = await page.evaluate(() => window.tool.commit(() => {
              return new URL(location.href).searchParams.get('epoch')
            }))
            expect(value).toBe('1')
            result = { pageshow, restored, actualBfcache: pageshow.persisted }
          }
          else {
            const value = await page.evaluate(() => window.tool.commit(() => {
              return new URL(location.href).searchParams.get('epoch')
            }))
            expect(value).toBe(scenario === 'rapid-navigation' ? '3' : '2')
            if (scenario === 'rapid-navigation') {
              await expect.poll(() => page.evaluate(() => window.states.intermediate.status)).toBe('resolved')
              expect(await page.evaluate(() => window.states.intermediate.value)).toBe(2)
            }
            if (scenario !== 'child-navigation') {
              await expect.poll(() => page.evaluate(() => window.states.new.status)).toBe('resolved')
              expect(await page.evaluate(() => window.states.new.value)).toBe(value)
            }
            result = await page.evaluate(() => ({ states: window.states, pending: Object.keys(window.tool.promises).length }))
            expect(result.pending).toBe(0)
          }
        }
        const timeline = await page.evaluate(() => window.timeline)
        expect(await page.evaluate(() => window.callbacks.some(packet => packet.type === 'artplayer-tool-iframe:session'))).toBe(false)
        await testInfo.attach('iframe-navigation', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), relation, scenario, parentOrigin, childOrigin, result, timeline, scope: 'Actual native frame navigation and postMessage; history-back records actual pageshow.persisted rather than assuming bfcache. Delayed-load barrier forces injection before load. Stale-packet tests replay old metadata from the controlled current frame to isolate document filtering. No media/player integration.' }) })
      }
      finally {
        releaseBarrier?.()
        await page.evaluate(() => {
          window.tool.destroy()
          document.querySelectorAll('iframe').forEach(frame => frame.remove())
        })
      }
    })
  }
}

for (const historical of (await iframeHistorical()).filter(item => ['published-artplayer-plugin-iframe.js', 'workspace.js'].includes(item.name))) {
  for (const relation of ['same-origin', 'cross-origin', 'opaque-origin']) {
    test(`Iframe legacy child navigation ${relation}/${historical.name}/${implementation.name}`, async ({ page }, testInfo) => {
      await page.goto('/test/player.html?core=published')
      const parentOrigin = new URL(page.url()).origin
      const childOrigin = relation === 'cross-origin' ? parentOrigin.replace('127.0.0.1', 'localhost') : parentOrigin
      const first = `${childOrigin}/test/iframe-boundary-child.html?global=${historical.global}&auto=1&epoch=1`
      const second = first.replace('auto=1&epoch=1', 'auto=0&epoch=2')
      await page.route('**/iframe-boundary-lib.js', route => route.fulfill({ contentType: 'text/javascript', body: historical.code }))
      await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.IframeFactory = module.exports.default || module.exports; })();` })
      await page.evaluate(({ first, opaque }) => {
        const frame = document.createElement('iframe')
        if (opaque)
          frame.sandbox = 'allow-scripts'
        document.body.append(frame)
        window.targetFrame = frame
        window.tool = new window.IframeFactory({ iframe: frame, url: first })
        window.states = {}
        window.track = (key, promise) => {
          window.states[key] = { status: 'pending' }
          promise.then(value => window.states[key] = { status: 'resolved', value }, error => window.states[key] = { status: 'rejected', error: error.message })
        }
      }, { first, opaque: relation === 'opaque-origin' })
      try {
        await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
        await page.evaluate((second) => {
          window.track('old', window.tool.postMessage({ type: 'hold' }))
          window.targetFrame.src = second
          window.track('new', window.tool.commit(() => {
            return new URL(location.href).searchParams.get('epoch')
          }))
        }, second)
        await expect.poll(() => page.frames().some(frame => frame.url() === second)).toBe(true)
        const child = page.frames().find(frame => frame.url() === second)
        await expect.poll(() => child.evaluate(() => Boolean(window.Tool))).toBe(true)
        await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('rejected')
        expect(await page.evaluate(() => window.tool.injected)).toBe(false)
        await child.evaluate(() => window.Tool.inject())
        await expect.poll(() => page.evaluate(() => window.states.new.status)).toBe('resolved')
        const result = await page.evaluate(() => ({ states: window.states, pending: Object.keys(window.tool.promises).length }))
        expect(result.states.new.value).toBe('2')
        expect(result.states.old.error).toBe('The iframe document has changed')
        expect(result.pending).toBe(0)
        await testInfo.attach('iframe-navigation', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), relation, scenario: 'legacy-child-source-change', child: { name: historical.name, sha256: hash(historical.code) }, parentOrigin, childOrigin, result, scope: 'Actual source attribute navigation with an immutable historical child. No document metadata or internal child navigation protection is claimed for an unchanged legacy peer.' }) })
      }
      finally {
        await page.evaluate(() => {
          window.tool.destroy()
          window.targetFrame.remove()
        })
      }
    })
  }
}
