import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8'))
const archives = new Map()
for (const release of baseline.releases) archives.set(release.name, await ensureArchive(release))
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm', '.vtt': 'text/vtt', '.png': 'image/png' }
let port = Number(process.env.ARTPLAYER_TEST_PORT || 8083)
assert(Number.isInteger(port) && port >= 0 && port < 65536, 'Invalid test port')

function sendBytes(req, res, bytes, filename) {
  res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Accept-Ranges', 'bytes')
  const range = req.headers.range
  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range)
    const start = match ? Number(match[1]) : -1
    const end = match?.[2] ? Math.min(Number(match[2]), bytes.length - 1) : bytes.length - 1
    if (start < 0 || start >= bytes.length || end < start) {
      res.writeHead(416, { 'Content-Range': `bytes */${bytes.length}` })
      res.end()
      return
    }
    res.statusCode = 206
    res.setHeader('Content-Range', `bytes ${start}-${end}/${bytes.length}`)
    bytes = bytes.subarray(start, end + 1)
  }
  res.setHeader('Content-Length', bytes.length)
  res.end(req.method === 'HEAD' ? undefined : bytes)
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`)
    if (req.method === 'POST' && url.pathname === '/reports/api') {
      assert.equal(req.headers.origin, `http://127.0.0.1:${port}`, 'Unexpected report origin')
      const chunks = []
      let size = 0
      for await (const chunk of req) {
        size += chunk.length
        assert(size <= 1024 * 1024, 'Report too large')
        chunks.push(chunk)
      }
      const report = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      assert.equal(report.kind, 'public-api')
      report.capture = {
        capturedAt: new Date().toISOString(),
        releases: baseline.releases.map(release => ({
          name: release.name, version: release.version, integrity: release.integrity,
          member: `package/${release.manifest.main.replace(/^\.\//, '')}`,
          sha256: release.files[`package/${release.manifest.main.replace(/^\.\//, '')}`],
        })),
        fixtureHashAlgorithm: 'sha256-lf',
        fixtures: Object.fromEntries(['api.html', 'api.js'].map(name => [name, hash(fs.readFileSync(path.join(refactorDir, 'fixtures', name), 'utf8').replaceAll('\r\n', '\n'))])),
      }
      const output = path.join(refactorDir, '.cache/reports')
      fs.mkdirSync(output, { recursive: true })
      fs.writeFileSync(path.join(output, 'api.json'), `${JSON.stringify(report, null, 2)}\n`)
      res.writeHead(204).end()
      return
    }
    assert(['GET', 'HEAD'].includes(req.method), 'Unsupported method')
    if (url.pathname.startsWith('/releases/')) {
      const [, , name, ...parts] = url.pathname.split('/')
      const release = baseline.releases.find(item => item.name === name)
      const member = `package/${parts.join('/')}`
      assert(release && Object.hasOwn(release.files, member), 'Unknown release member')
      sendBytes(req, res, readMember(archives.get(name), member), member)
      return
    }
    const prefix = url.pathname.startsWith('/assets/sample/') ? '/assets/sample/' : '/fixtures/'
    assert(url.pathname.startsWith(prefix), 'Unknown test route')
    const dir = prefix === '/fixtures/' ? path.join(refactorDir, 'fixtures') : path.join(root, 'docs/assets/sample')
    const filename = path.resolve(dir, decodeURIComponent(url.pathname.slice(prefix.length)))
    const relative = path.relative(dir, filename)
    assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Invalid fixture path')
    sendBytes(req, res, fs.readFileSync(filename), filename)
  }
  catch (error) {
    if (!res.headersSent) res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end(error.message)
  }
})
server.listen(port, '127.0.0.1', () => {
  port = server.address().port
  console.log(`Baseline browser server: http://127.0.0.1:${port}/fixtures/api.html`)
})
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close())
