import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { iframeCandidate, iframeHistorical } from '../helpers/iframe.js'
import { expect, test } from './fixtures.js'

const candidate = await iframeCandidate()
const published = (await iframeHistorical()).find(item => item.name === 'published-artplayer-plugin-iframe.js')
const demo = fs.readFileSync('docs/assets/example/iframe.js', 'utf8')
const childHtml = fs.readFileSync('docs/iframe.html', 'utf8')
const bridges = [[candidate, candidate], [published, candidate], [candidate, published], [published, published]]

for (const core of ['published-4.5.9', 'published', 'candidate']) {
  for (const relation of ['same-origin', 'cross-origin']) {
    for (const [parentTool, childTool] of bridges) {
      test(`Iframe player ${core}/${relation}/${parentTool.name}/${childTool.name}`, async ({ page, request }, testInfo) => {
        const coreResponse = await request.get(`/${core}/artplayer.js`)
        expect(coreResponse.ok()).toBe(true)
        const coreBytes = await coreResponse.body()
        await page.addInitScript(() => {
          window.mediaEvents = []
          window.documentWitness = Math.random().toString(36)
          for (const name of ['loadedmetadata', 'loadeddata', 'canplay', 'playing', 'pause', 'seeking', 'seeked', 'emptied', 'error']) {
            addEventListener(name, (event) => {
              if (event.target instanceof HTMLVideoElement)
                window.mediaEvents.push({ type: name, source: event.target.currentSrc, time: event.target.currentTime, error: event.target.error?.code })
            }, true)
          }
        })
        const bridge = implementation => `${implementation.code}\n${implementation === published ? 'window.ArtplayerToolIframe = window.ArtplayerPluginIframe;' : ''}`
        await page.route('**/uncompiled/artplayer-tool-iframe/index.js', route => route.fulfill({ contentType: 'text/javascript', body: bridge(childTool) }))
        await page.route('**/uncompiled/artplayer/index.js', route => route.fulfill({ contentType: 'text/javascript', body: coreBytes }))
        await page.goto('/test/player.html?core=published')
        await page.addStyleTag({ url: '/assets/css/style.css' })
        await page.evaluate(() => {
          document.body.innerHTML = '<div class="artplayer-app" style="width:640px;height:360px"></div>'
          window.messages = []
        })
        await page.addScriptTag({ content: bridge(parentTool) })
        const parentOrigin = new URL(page.url()).origin
        const childOrigin = relation === 'cross-origin' ? parentOrigin.replace('127.0.0.1', 'localhost') : parentOrigin
        const url = `${childOrigin}/iframe.html`
        const adaptedDemo = demo.replace('url: \'/iframe.html\'', `url: '${url}'`)
        expect(adaptedDemo).not.toBe(demo)
        await page.addScriptTag({ content: `${adaptedDemo}\nwindow.demoTool = iframe; window.demoFrame = $iframe; const originalCallback = iframe.messageCallback; iframe.message(function (packet) { originalCallback.call(this, packet); window.messages.push(packet); });` })
        let child
        try {
          await expect.poll(() => page.frames().some(frame => frame.url() === url)).toBe(true)
          child = page.frames().find(frame => frame.url() === url)
          await expect.poll(() => child.evaluate(() => {
            const art = window.Artplayer?.instances[0]
            return Boolean(art && art.video.readyState >= 2 && art.video.videoWidth > 0)
          })).toBe(true)
          const initial = await page.evaluate(() => window.demoTool.commit(() => {
            const art = window.Artplayer.instances[0]
            art.muted = true
            return { version: window.Artplayer.version, width: art.video.videoWidth, height: art.video.videoHeight, duration: art.duration, instances: window.Artplayer.instances.length, source: art.video.currentSrc }
          }))
          expect(initial.instances).toBe(1)
          expect(initial.source).toContain('/assets/sample/video.mp4')
          expect(initial.width).toBeGreaterThan(0)
          const play = await page.evaluate(() => window.demoTool.commit((resolve) => {
            window.Artplayer.instances[0].play().then(() => {
              const result = { playing: !window.Artplayer.instances[0].video.paused }
              resolve(result)
            }).catch((error) => {
              const result = { error: error.message }
              resolve(result)
            })
          }))
          expect(play).toEqual({ playing: true })
          await expect.poll(() => child.evaluate(() => window.Artplayer.instances[0].currentTime)).toBeGreaterThan(0.15)
          await child.locator('.art-video-player').hover()
          await child.locator('.art-control-fullscreenWeb').click()
          await expect(page.locator('iframe')).toHaveClass('fullscreenWeb')
          const fullscreen = await page.locator('iframe').boundingBox()
          expect(fullscreen.width).toBe(page.viewportSize().width)
          expect(fullscreen.height).toBe(page.viewportSize().height)
          await child.locator('.art-video-player').hover()
          await child.locator('.art-control-fullscreenWeb').click()
          await expect(page.locator('iframe')).not.toHaveClass('fullscreenWeb')
          expect(await page.evaluate(() => window.messages.filter(packet => packet.type === 'fullscreenWeb').map(packet => packet.data))).toEqual([true, false])
          await page.evaluate(() => window.demoTool.commit(() => {
            const art = window.Artplayer.instances[0]
            art.pause()
            art.currentTime = 1
            art.playbackRate = 1.25
          }))
          await expect.poll(() => child.evaluate(() => window.Artplayer.instances[0].video.seeking)).toBe(false)
          const seek = await child.evaluate(() => ({ time: window.Artplayer.instances[0].currentTime, rate: window.Artplayer.instances[0].video.playbackRate, paused: window.Artplayer.instances[0].video.paused }))
          expect(seek.time).toBeCloseTo(1, 1)
          expect(seek.rate).toBe(1.25)
          expect(seek.paused).toBe(true)
          const switched = await page.evaluate(() => window.demoTool.commit((resolve) => {
            const art = window.Artplayer.instances[0]
            art.switchUrl('/test/pattern.mp4').then(() => {
              const result = { source: art.video.currentSrc, width: art.video.videoWidth }
              resolve(result)
            }).catch((error) => {
              const result = { error: error.message }
              resolve(result)
            })
          }))
          expect(switched.error).toBeUndefined()
          expect(switched.source).toContain('/test/pattern.mp4')
          await expect.poll(() => child.evaluate(() => window.Artplayer.instances[0].video.readyState >= 2)).toBe(true)
          const events = await child.evaluate(() => window.mediaEvents)
          expect(events.some(event => event.type === 'playing')).toBe(true)
          expect(events.some(event => event.type === 'seeked')).toBe(true)
          expect(events.filter(event => event.type === 'error')).toEqual([])
          const destroyed = await page.evaluate(() => window.demoTool.commit(() => {
            window.Artplayer.instances[0].destroy()
            return { instances: window.Artplayer.instances.length, players: document.querySelectorAll('.art-video-player').length }
          }))
          expect(destroyed).toEqual({ instances: 0, players: 0 })
          const afterDestroy = await page.evaluate(() => window.demoTool.commit(() => {
            return 17
          }))
          expect(afterDestroy).toBe(17)
          await testInfo.attach('iframe-player', { contentType: 'application/json', body: JSON.stringify({ core, coreSha256: hash(coreBytes), parent: { name: parentTool.name, sha256: hash(parentTool.code) }, child: { name: childTool.name, sha256: hash(childTool.code) }, relation, initial, seek, switched, destroyed, events, demoSha256: hash(demo), adaptedDemoSha256: hash(adaptedDemo), childHtmlSha256: hash(childHtml), scope: 'Actual docs iframe.html, parent example and CSS in a minimal parent harness; only source URL and explicit test-only old global-name aliases are adapted. Actual media plays/seeks/switches, fullscreenWeb control sends messages and both core/tool lifetimes are tested independently. No complete Monaco/device/BFCache claim.' }) })
        }
        finally {
          if (child && !child.isDetached()) {
            await child.evaluate(() => {
              for (const art of [...(window.Artplayer?.instances || [])]) art.destroy()
            })
          }
          await page.evaluate(() => {
            window.demoTool?.destroy()
            window.demoFrame?.remove()
          })
        }
      })
    }
  }
}
