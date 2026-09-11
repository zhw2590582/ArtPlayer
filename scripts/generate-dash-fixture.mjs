import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash } from '../refactor/scripts/releases.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = path.resolve(root, process.argv[2] || 'test/browser/media/dash')
assert(!fs.existsSync(output), 'Use a new directory; never overwrite frozen media')
const ffmpeg = process.env.ARTPLAYER_FFMPEG || 'ffmpeg'
const version = execFileSync(ffmpeg, ['-version'], { encoding: 'utf8' }).split(/\r?\n/)[0]
fs.mkdirSync(output, { recursive: true })
const args = [
  ['-hide_banner', '-loglevel', 'error', '-n'],
  ['-f', 'lavfi', '-i', 'testsrc2=size=160x90:rate=24'],
  ['-f', 'lavfi', '-i', 'testsrc2=size=320x180:rate=24'],
  ['-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000'],
  ['-f', 'lavfi', '-i', 'sine=frequency=880:sample_rate=48000'],
  ['-t', '12', '-map', '0:v', '-map', '1:v', '-map', '2:a', '-map', '3:a'],
  ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'baseline', '-level:v', '3.0'],
  ['-b:v:0', '150k', '-b:v:1', '350k', '-g', '48', '-keyint_min', '48', '-sc_threshold', '0'],
  ['-c:a', 'aac', '-b:a', '48k', '-ac', '2', '-metadata:s:a:0', 'language=en', '-metadata:s:a:1', 'language=fr'],
  ['-f', 'dash', '-seg_duration', '2', '-use_template', '1', '-use_timeline', '1'],
  ['-adaptation_sets', 'id=0,streams=0,1 id=1,streams=2 id=2,streams=3'],
  ['-init_seg_name', 'init-$RepresentationID$.m4s', '-media_seg_name', 'chunk-$RepresentationID$-$Number%05d$.m4s', 'master.mpd'],
].flat()
execFileSync(ffmpeg, args, { cwd: output, stdio: 'pipe', timeout: 120000 })
const master = fs.readFileSync(path.join(output, 'master.mpd'), 'utf8')
const audioSets = /<AdaptationSet\b[^>]+contentType="audio"[\s\S]*?<\/AdaptationSet>/g
assert.equal([...master.matchAll(audioSets)].length, 2)
const videoOnly = master.replace(audioSets, '')
assert(!videoOnly.includes('contentType="audio"'))
fs.writeFileSync(path.join(output, 'video-only.mpd'), videoOnly)
const single = videoOnly.replace(/<Representation\b[^>]+id="1"[\s\S]*?<\/Representation>/, '')
assert.equal([...single.matchAll(/<Representation\b/g)].length, 1)
fs.writeFileSync(path.join(output, 'single.mpd'), single)
const files = Object.fromEntries(fs.readdirSync(output).sort().map(name => [name, { sha256: hash(fs.readFileSync(path.join(output, name))), bytes: fs.statSync(path.join(output, name)).size }]))
fs.writeFileSync(path.join(output, 'manifest.json'), `${JSON.stringify({ kind: 'generated-dash-media', version, duration: 12, videoHeights: [90, 180], audio: [{ lang: 'en', frequency: 440 }, { lang: 'fr', frequency: 880 }], commands: [args], files }, null, 2)}\n`)
console.log(`Generated ${Object.keys(files).length} DASH files in ${output}`)
