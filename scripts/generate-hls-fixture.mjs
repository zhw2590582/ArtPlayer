import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash } from '../refactor/scripts/releases.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = path.resolve(root, process.argv[2] || 'test/browser/media/hls')
const duration = Number(process.argv[3] || 12)
assert(Number.isInteger(duration) && duration >= 12 && duration <= 3600, 'Duration must be 12..3600 whole seconds')
assert(!fs.existsSync(output), 'Output must be a new directory; never overwrite frozen media')
const ffmpeg = process.env.ARTPLAYER_FFMPEG || 'ffmpeg'
const version = execFileSync(ffmpeg, ['-version'], { encoding: 'utf8' }).split(/\r?\n/)[0]
fs.mkdirSync(output, { recursive: true })
const commands = []
function generate(name, input, encoding) {
  const args = ['-hide_banner', '-loglevel', 'error', '-n', '-f', 'lavfi', '-i', input, '-t', String(duration), ...encoding, '-f', 'hls', '-hls_time', '2', '-hls_playlist_type', 'vod', '-hls_segment_filename', `${name}-%02d.mpegts`, `${name}.m3u8`]
  execFileSync(ffmpeg, args, { cwd: output, stdio: 'pipe' })
  commands.push(args)
}
for (const [name, size] of [['low', '160x90'], ['high', '320x180']]) {
  generate(name, `testsrc2=size=${size}:rate=24`, ['-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'baseline', '-level:v', '3.0', '-g', '48', '-keyint_min', '48', '-sc_threshold', '0', '-crf', '28'])
}
for (const [name, frequency] of [['english', 440], ['french', 880]])
  generate(name, `sine=frequency=${frequency}:sample_rate=48000`, ['-vn', '-c:a', 'aac', '-b:a', '48k', '-ac', '2'])
const variants = '#EXT-X-STREAM-INF:BANDWIDTH=200000,RESOLUTION=160x90,CODECS="avc1.42c01e,mp4a.40.2",AUDIO="audio"\nlow.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=320x180,CODECS="avc1.42c01e,mp4a.40.2",AUDIO="audio"\nhigh.m3u8\n'
fs.writeFileSync(path.join(output, 'master.m3u8'), `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="English",LANGUAGE="en",DEFAULT=YES,AUTOSELECT=YES,URI="english.m3u8"\n#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",NAME="French",LANGUAGE="fr",DEFAULT=NO,AUTOSELECT=YES,URI="french.m3u8"\n${variants}`)
fs.writeFileSync(path.join(output, 'video-only.m3u8'), '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=200000,RESOLUTION=160x90,CODECS="avc1.42c01e"\nlow.m3u8\n')
const files = Object.fromEntries(fs.readdirSync(output).sort().map(name => [name, { sha256: hash(fs.readFileSync(path.join(output, name))), bytes: fs.statSync(path.join(output, name)).size }]))
fs.writeFileSync(path.join(output, 'manifest.json'), `${JSON.stringify({ kind: 'generated-hls-media', version, duration, commands, files }, null, 2)}\n`)
console.log(`Generated ${Object.keys(files).length} HLS files in ${output}`)
