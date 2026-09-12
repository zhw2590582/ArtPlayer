import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { hash } from '../refactor/scripts/releases.mjs'

const output = path.resolve(process.argv[2] || 'refactor/.cache/auto-thumbnail-fixture')
assert(!fs.existsSync(output), 'Use a new directory; never overwrite frozen media')
const ffmpeg = process.env.ARTPLAYER_FFMPEG || 'ffmpeg'
const version = execFileSync(ffmpeg, ['-version'], { encoding: 'utf8' }).split(/\r?\n/)[0]
fs.mkdirSync(output, { recursive: true })
const segments = [['purple', '0.033333333'], ['red', '1.966666667'], ['black', '2'], ['blue', '2'], ['yellow', '2']]
const args = [
  '-hide_banner',
  '-loglevel',
  'error',
  '-n',
  ...segments.flatMap(([color, duration]) => ['-f', 'lavfi', '-i', `color=c=${color}:s=320x180:r=30:d=${duration}`]),
  '-filter_complex',
  '[0:v][1:v][2:v][3:v][4:v]concat=n=5:v=1:a=0[v]',
  '-map',
  '[v]',
  '-c:v',
  'libx264',
  '-pix_fmt',
  'yuv420p',
  '-g',
  '30',
  '-movflags',
  '+faststart',
  'auto-thumbnail-timeline.mp4',
]
execFileSync(ffmpeg, args, { cwd: output, stdio: 'pipe', timeout: 120000 })
const bytes = fs.readFileSync(path.join(output, 'auto-thumbnail-timeline.mp4'))
fs.writeFileSync(path.join(output, 'manifest.json'), `${JSON.stringify({
  kind: 'generated-auto-thumbnail-timeline',
  version,
  args,
  width: 320,
  height: 180,
  fps: 30,
  duration: 8,
  segments,
  purpose: 'Unique purple first frame, then red/black/blue/yellow timeline; distinguish missing transparent pixels, legitimate black frames and stale first frames.',
  file: { name: 'auto-thumbnail-timeline.mp4', bytes: bytes.length, sha256: hash(bytes) },
}, null, 2)}\n`)
console.log(`Generated auto-thumbnail timeline in ${output}`)
