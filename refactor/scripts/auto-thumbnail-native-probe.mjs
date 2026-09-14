import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { chromium, firefox, webkit } from '@playwright/test'
import { startDevServer } from '../../scripts/library/server.ts'

assert.equal(process.version.slice(1), fs.readFileSync('.node-version', 'utf8').trim())
assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn probe:auto-thumbnail-native')
assert.equal(process.argv.length, 2, 'No probe arguments are supported')
const fingerprint = data => createHash('sha256').update(data).digest('hex')
const original = 'test/browser/media/auto-thumbnail-timeline.mp4'
const originalBytes = fs.readFileSync(original)
assert.equal(fingerprint(originalBytes), JSON.parse(fs.readFileSync('refactor/baselines/auto-thumbnail-timeline-media.json')).file.sha256)
const directory = fs.mkdtempSync('refactor/.cache/auto-thumbnail-native-')
fs.writeFileSync(path.join(directory, 'index.html'), '<!doctype html><title>Native decoder diagnostic</title>')
fs.copyFileSync(original, path.join(directory, 'original.mp4'))
const ffmpeg = process.env.FFMPEG || 'ffmpeg'
const ffprobe = process.env.FFPROBE || 'ffprobe'
const args = ['-hide_banner', '-loglevel', 'error', '-n', '-i', original, '-map', '0:v:0', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-bf', '0', '-g', '30', '-crf', '18', '-movflags', '+faststart', path.join(directory, 'no-b-frames.mp4')]
execFileSync(ffmpeg, args, { windowsHide: true })
const ffmpegVersion = execFileSync(ffmpeg, ['-version'], { encoding: 'utf8', windowsHide: true }).split('\n')[0].trim()
const media = ['original.mp4', 'no-b-frames.mp4'].map((name) => {
  const file = path.join(directory, name)
  const metadata = JSON.parse(execFileSync(ffprobe, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,profile,time_base,start_time,duration,has_b_frames', '-of', 'json', file], { encoding: 'utf8', windowsHide: true }))
  const raw = execFileSync(ffmpeg, ['-v', 'error', '-i', file, '-frames:v', '1', '-vf', 'scale=1:1', '-pix_fmt', 'rgba', '-f', 'rawvideo', 'pipe:1'], { windowsHide: true })
  assert.equal(raw.length, 4)
  assert(raw[0] > 100 && raw[2] > 100 && raw[1] < 40, 'Both files must actually decode a purple first frame')
  return { file, sha256: fingerprint(fs.readFileSync(file)), metadata, ffmpegFirstPixel: [...raw] }
})
const errors = []
const server = await startDevServer({ root: directory, port: 0, onError: error => errors.push(String(error)) })
const results = []
console.log(`Native decoder diagnostics: ${directory}`)
try {
  for (const [engineName, engine] of Object.entries({ webkit, chromium, firefox })) {
    const browser = await engine.launch()
    try {
      for (const file of ['original.mp4', 'no-b-frames.mp4']) {
        for (const mode of ['paused', 'visible-paused', 'play-pause']) {
          const page = await browser.newPage()
          try {
            await page.goto(server.url)
            const result = await page.evaluate(async ({ file, mode }) => {
              const video = document.createElement('video')
              video.width = 320
              video.height = 180
              video.muted = true
              video.playsInline = true
              video.style.cssText = 'position:fixed;visibility:hidden;width:320px;height:180px'
              if (mode === 'visible-paused')
                video.style.visibility = 'visible'
              document.body.append(video)
              const canvas = document.createElement('canvas')
              canvas.width = 320
              canvas.height = 180
              const context = canvas.getContext('2d')
              const samples = []
              const events = []
              const started = performance.now()
              let timer
              const state = () => ({ elapsed: performance.now() - started, time: video.currentTime, readyState: video.readyState, paused: video.paused, seeking: video.seeking })
              for (const name of ['loadedmetadata', 'loadeddata', 'canplay', 'play', 'playing', 'pause', 'seeked', 'error'])
                video.addEventListener(name, () => events.push({ name, ...state() }))
              try {
                const ready = new Promise((resolve, reject) => {
                  video.onloadeddata = resolve
                  video.onerror = () => reject(new Error(`Media error ${video.error?.code}`))
                  timer = setTimeout(() => reject(new Error('Native loadeddata timeout')), 8000)
                })
                video.src = `/${file}`
                await ready
                clearTimeout(timer)
                if (mode === 'play-pause') {
                  await Promise.race([
                    video.play(),
                    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Native play timeout')), 8000) }),
                  ])
                  clearTimeout(timer)
                  video.pause()
                }
                for (let index = 0; index < 31; index++) {
                  context.clearRect(0, 0, 320, 180)
                  context.drawImage(video, 0, 0)
                  samples.push({ ...state(), rgba: [...context.getImageData(160, 90, 1, 1).data] })
                  await new Promise(resolve => setTimeout(resolve, 16))
                }
                return { samples, events, mediaError: video.error?.code || 0, supportsFrames: typeof video.requestVideoFrameCallback === 'function' }
              }
              finally {
                clearTimeout(timer)
                video.pause()
                video.removeAttribute('src')
                video.load()
                video.remove()
                canvas.width = canvas.height = 0
              }
            }, { file, mode })
            const purple = result.samples.filter(({ rgba: [r, g, b, a] }) => a === 255 && Math.min(r, b) > 100 && Math.abs(r - b) < 30 && g < 40)
            const entry = { engine: engineName, browser: browser.version(), file, mode, purpleSamples: purple.length, ...result }
            results.push(entry)
            console.log(JSON.stringify({ engine: engineName, file, mode, purpleSamples: purple.length, first: result.samples[0], last: result.samples.at(-1) }))
          }
          finally { await page.close() }
        }
      }
    }
    finally { await browser.close() }
  }
}
finally {
  await server.close()
  assert.deepEqual(errors, [])
  assert.equal(fingerprint(fs.readFileSync(original)), fingerprint(originalBytes))
  fs.writeFileSync(path.join(directory, 'report.json'), `${JSON.stringify({ task: 'PKG-AUTO-THUMB-03', capturedAt: new Date().toISOString(), node: process.version, platform: process.platform, ffmpegVersion, args, media, results, scope: 'Native video/canvas only; no ArtPlayer/plugin imported. No-seek hidden/visible paused and hidden play-pause controls capture31 draws separated by16ms requested timers; actual elapsed durations are recorded. The no-B-frame transcode is diagnostic only and never replaces the frozen acceptance fixture. Counts report observations, not acceptance or a production fix.' }, null, 2)}\n`)
}
