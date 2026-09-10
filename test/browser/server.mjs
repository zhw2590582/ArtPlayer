/* eslint-disable antfu/no-top-level-await -- Build test resources before accepting requests. */
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { getEntryFile } from '../../scripts/projects.js'
import { getGlobalName, getViteBuildConfig } from '../../scripts/utils.js'

const workspace = fileURLToPath(new URL('../../', import.meta.url))

const port = Number(process.env.ARTPLAYER_BROWSER_PORT || 8084)
assert(Number.isInteger(port) && port > 0 && port < 65536, 'Invalid browser test port')
const files = new Map()
const requests = new Map()
const manifest = { kind: 'artplayer-browser-test', resources: {} }
function add(route, bytes, source) {
  files.set(route, bytes)
  manifest.resources[route] = { source, sha256: hash(bytes), bytes: bytes.length }
}

// An explicit artifact map takes precedence over source builds and never falls back.
const mapFile = process.env.ARTPLAYER_BROWSER_ARTIFACTS
const overrides = mapFile ? JSON.parse(fs.readFileSync(mapFile, 'utf8')) : {}
for (const name of ['artplayer', 'artplayer-plugin-chapter']) {
  const route = `/candidate/${name}.js`
  if (mapFile) {
    assert(Object.hasOwn(overrides, name), `Missing candidate artifact: ${name}`)
    const filename = path.resolve(path.dirname(path.resolve(mapFile)), overrides[name])
    add(route, fs.readFileSync(filename), { kind: 'artifact', file: filename })
  }
  else {
    const project = path.join(workspace, 'packages', name)
    const config = getViteBuildConfig({ entry: getEntryFile(project), name: getGlobalName(name), format: 'umd', fileName: `${name}.js`, minify: false })
    config.build.write = false
    const result = await build({ root: project, ...config })
    const chunks = (Array.isArray(result) ? result : [result]).flatMap(item => item.output).filter(item => item.type === 'chunk')
    assert.equal(chunks.length, 1, 'Browser source loader requires one self-contained chunk')
    add(route, Buffer.from(chunks[0].code), { kind: 'workspace-build', entry: path.relative(workspace, getEntryFile(project)) })
  }
  for (const alias of [`/compiled/${name}.js`, `/uncompiled/${name}/index.js`]) {
    files.set(alias, files.get(route))
    manifest.resources[alias] = { ...manifest.resources[route], aliasOf: route }
  }
}
const releases = JSON.parse(fs.readFileSync(path.join(workspace, 'refactor/baselines/releases.json'), 'utf8')).releases
for (const release of releases) {
  const member = `package/${release.manifest.main.replace(/^\.\//, '')}`
  const bytes = readMember(await ensureArchive(release), member)
  assert.equal(hash(bytes), release.files[member], 'Published browser artifact differs from frozen baseline')
  add(`/published/${release.name}.js`, bytes, { kind: 'npm-release', version: release.version, integrity: release.integrity, member })
}
for (const extension of ['mp4', 'webm']) {
  const name = `test/browser/media/pattern.${extension}`
  add(`/test/pattern.${extension}`, fs.readFileSync(path.join(workspace, name)), { kind: 'generated-media', file: name })
}

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.mp4': 'video/mp4', '.webm': 'video/webm', '.vtt': 'text/vtt', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' }
add('/test/declaration-cues.vtt', fs.readFileSync(path.join(workspace, 'test/browser/media/declaration-cues.vtt')), { kind: 'test-subtitles', file: 'test/browser/media/declaration-cues.vtt' })
function send(req, res, bytes, filename) {
  res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Accept-Ranges', 'bytes')
  if (req.headers.range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range)
    const start = match?.[1] ? Number(match[1]) : Math.max(0, bytes.length - Number(match?.[2]))
    const end = match?.[1] && match[2] ? Math.min(bytes.length - 1, Number(match[2])) : bytes.length - 1
    if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) || start > end || start >= bytes.length) {
      res.writeHead(416, { 'Content-Range': `bytes */${bytes.length}` }).end()
      return
    }
    res.statusCode = 206
    res.setHeader('Content-Range', `bytes ${start}-${end}/${bytes.length}`)
    bytes = bytes.subarray(start, end + 1)
  }
  res.setHeader('Content-Length', bytes.length)
  res.end(req.method === 'HEAD' ? undefined : bytes)
}

add('/assets/sample/video.mp4', fs.readFileSync(path.join(workspace, 'docs/assets/sample/video.mp4')), { kind: 'docs-media', file: 'docs/assets/sample/video.mp4' })

const server = http.createServer((req, res) => {
  try {
    assert(['GET', 'HEAD'].includes(req.method), 'Unsupported method')
    const url = new URL(req.url, `http://127.0.0.1:${port}`)
    const caseId = url.searchParams.get('case')
    if (url.pathname === '/test/requests.json') {
      send(req, res, Buffer.from(JSON.stringify(requests.get(caseId) || [])), 'requests.json')
      return
    }
    if (caseId && /\.(?:mp4|webm)$/.test(url.pathname)) {
      assert(caseId.length <= 200 && (requests.has(caseId) || requests.size < 10000), 'Test request log limit')
      const records = requests.get(caseId) || []
      if (records.length < 100)
        records.push({ path: url.pathname, range: req.headers.range || null, method: req.method })
      requests.set(caseId, records)
    }
    if (url.pathname === '/favicon.ico') {
      res.writeHead(204).end()
      return
    }
    if (url.pathname === '/test/manifest.json') {
      send(req, res, Buffer.from(JSON.stringify(manifest)), 'manifest.json')
      return
    }
    if (url.pathname === '/test/fail.mp4') {
      res.writeHead(503, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }).end('Intentional media failure')
      return
    }
    if (files.has(url.pathname)) {
      send(req, res, files.get(url.pathname), url.pathname)
      return
    }
    if (url.pathname === '/test/player.html') {
      const core = url.searchParams.get('core') || 'candidate'
      const chapter = url.searchParams.get('chapter') || 'candidate'
      assert(['candidate', 'published'].includes(core) && ['candidate', 'published'].includes(chapter), 'Invalid test combination')
      const html = fs.readFileSync(path.join(workspace, 'test/browser/player.html'), 'utf8')
        .replace('__CORE__', core)
        .replace('__CHAPTER__', chapter)
      send(req, res, Buffer.from(html), 'player.html')
      return
    }
    assert(!/^\/(?:test|candidate|published|compiled|uncompiled)\//.test(url.pathname), 'Unmapped test artifact')
    const root = fs.realpathSync(path.join(workspace, 'docs'))
    let filename = path.resolve(root, `.${decodeURIComponent(url.pathname)}`)
    if (fs.statSync(filename).isDirectory())
      filename = path.join(filename, 'index.html')
    const relative = path.relative(root, fs.realpathSync(filename))
    assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Invalid docs path')
    send(req, res, fs.readFileSync(filename), filename)
  }
  catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end(error.message)
  }
})
server.listen(port, '127.0.0.1', () => process.stdout.write(`Browser test server: http://127.0.0.1:${port}\n`))
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close())
