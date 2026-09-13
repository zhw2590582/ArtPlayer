import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import http from 'node:http'
import process from 'node:process'
import { chromium, firefox, webkit } from '@playwright/test'

const bundle = fs.readFileSync('packages/artplayer-plugin-auto-thumbnail/dist/artplayer-plugin-auto-thumbnail.mjs', 'utf8')
const bytes = fs.readFileSync('test/browser/media/auto-thumbnail-timeline.mp4')
assert.equal(process.version.slice(1), fs.readFileSync('.node-version', 'utf8').trim())
assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn probe:auto-thumbnail-rendering')
const output = fs.mkdtempSync('refactor/.cache/auto-thumbnail-rendering-')
console.log(`Rendering diagnostics: ${output}`)
const fingerprint = data => createHash('sha256').update(data).digest('hex')
assert.equal(fingerprint(bytes), JSON.parse(fs.readFileSync('refactor/baselines/auto-thumbnail-timeline-media.json')).file.sha256, 'The unique-frame diagnostic requires the frozen timeline fixture')
assert(bundle.includes('const ready = !presentedFrames || video.readyState >= 2;'))
assert(bundle.includes('visibility:hidden;'))
assert.equal(bundle.match(/let pending;/g)?.length, 1)
assert.equal(bundle.match(/video.currentTime = target;/g)?.length, 1)
const server = http.createServer((request, response) => {
  if (request.url !== '/video.mp4') {
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end('<!doctype html><title>Frame rendering probe</title>')
    return
  }
  const match = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range || '')
  const start = match ? Number(match[1]) : 0
  const end = match?.[2] ? Math.min(Number(match[2]), bytes.length - 1) : bytes.length - 1
  response.writeHead(match ? 206 : 200, { 'Content-Type': 'video/mp4', 'Content-Length': end - start + 1, 'Accept-Ranges': 'bytes', ...(match ? { 'Content-Range': `bytes ${start}-${end}/${bytes.length}` } : {}) })
  response.end(bytes.subarray(start, end + 1))
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const styles = { hidden: 'visibility:hidden;', opacity: 'visibility:visible;opacity:0;', clip: 'visibility:visible;clip-path:inset(50%);', visible: 'visibility:visible;' }
const results = []
function purple([red, green, blue, alpha]) {
  return alpha === 255 && Math.min(red, blue) > 100 && Math.abs(red - blue) < 30 && green < 40
}
try {
  for (const [engineName, engine] of Object.entries({ webkit, chromium, firefox })) {
    const browser = await engine.launch()
    try {
      const variants = engineName === 'webkit'
        ? Object.entries(styles).flatMap(([style, css]) => ['current', 'ready-state', 'loaded-event'].map(readiness => ({ style, css, readiness })))
        : [{ style: 'hidden', css: styles.hidden, readiness: 'current' }]
      for (const variant of variants) {
        const page = await browser.newPage()
        await page.goto(`http://127.0.0.1:${server.address().port}`)
        let code = bundle.replace('visibility:hidden;', variant.css)
        if (variant.readiness === 'ready-state')
          code = code.replace('const ready = !presentedFrames || video.readyState >= 2;', 'const ready = video.readyState >= 2;')
        if (variant.readiness === 'loaded-event')
          code = code.replace('let pending;', 'let pending; let firstFrame = true;').replace('const ready = !presentedFrames || video.readyState >= 2;', 'const ready = !firstFrame; firstFrame = false;')
        code = code.replace('video.currentTime = target;', '{ window.__thumbnailSeeks.push({target, loadedData: window.__thumbnailData, readyState: video.readyState}); video.currentTime = target; }')
        const result = await page.evaluate(async (code) => {
          const draws = []
          const events = []
          const updates = []
          const warnings = []
          const videos = []
          window.__thumbnailData = 0
          window.__thumbnailSeeks = []
          const create = document.createElement.bind(document)
          const draw = CanvasRenderingContext2D.prototype.drawImage
          const originalWarn = console.warn
          console.warn = (...args) => warnings.push(args.map(String))
          document.createElement = (...args) => {
            const element = create(...args)
            if (args[0] === 'video') {
              videos.push(element)
              element.addEventListener('loadeddata', () => window.__thumbnailData++)
              for (const name of ['loadedmetadata', 'loadeddata', 'canplay', 'seeked', 'playing']) element.addEventListener(name, () => events.push({ name, time: element.currentTime, readyState: element.readyState, decoded: element.webkitDecodedFrameCount, total: element.getVideoPlaybackQuality?.().totalVideoFrames }))
            }
            return element
          }
          CanvasRenderingContext2D.prototype.drawImage = function (source, ...args) {
            const result = draw.call(this, source, ...args)
            if (source instanceof HTMLVideoElement) {
              const [x, y, width, height] = args
              draws.push({ time: source.currentTime, rgba: [...this.getImageData(x + Math.floor(width / 2), y + Math.floor(height / 2), 1, 1).data], readyState: source.readyState, decoded: source.webkitDecodedFrameCount, total: source.getVideoPlaybackQuality?.().totalVideoFrames, box: { width: source.getBoundingClientRect().width, height: source.getBoundingClientRect().height } })
            }
            return result
          }
          const listeners = new Map()
          let finish
          const done = new Promise(resolve => finish = resolve)
          const art = {
            option: { url: '/video.mp4' },
            on(name, fn) {
              if (!listeners.has(name))
                listeners.set(name, new Set())
              listeners.get(name).add(fn)
            },
            off(name, fn) { listeners.get(name)?.delete(fn) },
            get thumbnails() { return updates.at(-1) },
            set thumbnails(value) {
              updates.push(value)
              if (updates.length === 5)
                finish('completed')
            },
          }
          const emit = (name) => {
            for (const fn of [...(listeners.get(name) || [])]) fn()
          }
          let timer
          try {
            const { default: factory } = await import(`data:text/javascript,${encodeURIComponent(code)}`)
            await factory({ width: 80, number: 5 })(art)
            timer = setTimeout(() => finish('timeout'), 8000)
            emit('video:loadedmetadata')
            const outcome = await done
            return { outcome, draws, events, warnings, seeks: window.__thumbnailSeeks, supportsFrames: typeof videos[0]?.requestVideoFrameCallback === 'function' && typeof videos[0]?.cancelVideoFrameCallback === 'function' }
          }
          finally {
            clearTimeout(timer)
            emit('destroy')
            document.createElement = create
            CanvasRenderingContext2D.prototype.drawImage = draw
            console.warn = originalWarn
          }
        }, code)
        const firstFrameMatches = result.draws[0] ? purple(result.draws[0].rgba) : false
        const entry = { engine: engineName, browser: browser.version(), ...variant, codeSha256: fingerprint(code), firstFrameMatches, ...result }
        results.push(entry)
        console.log(JSON.stringify({ engine: engineName, ...variant, outcome: result.outcome, firstFrameMatches, seeks: result.seeks, draws: result.draws.map(item => ({ time: item.time, rgba: item.rgba, total: item.total })) }))
        await page.close()
      }
    }
    finally { await browser.close() }
  }
}
finally {
  await new Promise(resolve => server.close(resolve))
  assert.equal(fs.readFileSync('packages/artplayer-plugin-auto-thumbnail/dist/artplayer-plugin-auto-thumbnail.mjs', 'utf8'), bundle)
  fs.writeFileSync(`${output}/report.json`, `${JSON.stringify({ capturedAt: new Date().toISOString(), environment: { node: process.version, platform: process.platform, arch: process.arch }, sourceSha256: fingerprint(bundle), mediaSha256: fingerprint(bytes), results, scope: 'Diagnostic capture, not acceptance. Four intrinsic-size rendering modes and three first-frame readiness strategies are compared in WebKit on the recorded host. Chromium/Firefox current-code controls retain native presentation callbacks. No production file is changed; missing or incorrect pixels remain explicit.' }, null, 2)}\n`)
}
