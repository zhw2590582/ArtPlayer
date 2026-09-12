/* eslint-disable antfu/no-top-level-await -- Assemble immutable test resources before listening. */
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { iframeCandidate } from '../helpers/iframe.js'
import { compilePackage } from '../helpers/load.js'

const port = Number(process.env.ARTPLAYER_IFRAME_HISTORY_PORT || 8085)
assert(Number.isInteger(port) && port > 0 && port < 65536)
const tool = await iframeCandidate()
const mapFile = process.env.ARTPLAYER_BROWSER_ARTIFACTS
let coreBytes
if (mapFile) {
  const map = JSON.parse(fs.readFileSync(mapFile))
  assert(typeof map.artplayer === 'string', 'Missing explicit core artifact')
  coreBytes = fs.readFileSync(path.resolve(path.dirname(mapFile), map.artplayer))
}
else {
  coreBytes = Buffer.from(await compilePackage('artplayer', 'umd'))
}
const cores = new Map([['candidate', coreBytes]])
const releases = JSON.parse(fs.readFileSync('refactor/baselines/releases.json')).releases
const oldCore = JSON.parse(fs.readFileSync('refactor/baselines/iframe-core.json')).release
for (const release of [oldCore, releases.find(release => release.name === 'artplayer')]) {
  const member = `package/${release.manifest.main.replace(/^\.\//, '')}`
  const bytes = readMember(await ensureArchive(release), member)
  assert.equal(hash(bytes), release.files[member])
  cores.set(release.version, bytes)
}
const files = new Map(['parent.html', 'child.html', 'observe.js'].map(name => [name, fs.readFileSync(new URL(name, import.meta.url))]))
files.set('tool.js', Buffer.from(tool.code))
files.set('pattern.mp4', fs.readFileSync('test/browser/media/pattern.mp4'))
const manifest = { tool: { name: tool.name, sha256: hash(tool.code) }, cores: Object.fromEntries([...cores].map(([name, bytes]) => [name, hash(bytes)])), files: Object.fromEntries([...files].map(([name, bytes]) => [name, hash(bytes)])) }
const stalled = new Map()
function send(req, res, bytes, type) {
  res.setHeader('Content-Type', type)
  res.setHeader('Cache-Control', 'public, max-age=60')
  if (req.headers.range) {
    const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range)
    const start = Number(range?.[1])
    const end = range?.[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1
    if (!range || start > end || start >= bytes.length) {
      res.writeHead(416).end()
      return
    }
    res.statusCode = 206
    res.setHeader('Content-Range', `bytes ${start}-${end}/${bytes.length}`)
    bytes = bytes.subarray(start, end + 1)
  }
  res.setHeader('Content-Length', bytes.length)
  res.setHeader('Accept-Ranges', 'bytes')
  res.end(bytes)
}
const server = http.createServer((req, res) => {
  try {
    assert.equal(req.method, 'GET')
    const url = new URL(req.url, `http://127.0.0.1:${port}`)
    if (url.pathname === '/manifest.json') {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(manifest))
      return
    }
    if (url.pathname === '/away.html') {
      send(req, res, Buffer.from('<!doctype html><title>Away</title><p>Away from player</p>'), 'text/html')
      return
    }
    if (url.pathname === '/favicon.ico') {
      res.writeHead(204).end()
      return
    }
    if (['/stall', '/release', '/status'].includes(url.pathname)) {
      const id = url.searchParams.get('case')
      assert(id && /^[a-f0-9]{16}$/.test(id))
      if (url.pathname === '/stall') {
        assert(!stalled.has(id) && stalled.size < 100, 'Duplicate or excessive test barrier')
        stalled.set(id, res)
        res.on('close', () => {
          if (stalled.get(id) === res)
            stalled.delete(id)
        })
        return
      }
      if (url.pathname === '/release') {
        const pending = stalled.get(id)
        assert(pending, 'No stalled request')
        if (url.searchParams.get('mode') === 'reset') {
          pending.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': 1000 })
          pending.write('<!doctype html><title>Interrupted response</title>', () => pending.destroy())
        }
        else {
          pending.writeHead(204).end()
        }
      }
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify({ pending: stalled.has(id) }))
      return
    }
    if (url.pathname === '/core.js') {
      const bytes = cores.get(url.searchParams.get('core'))
      assert(bytes, 'Unknown core')
      send(req, res, bytes, 'text/javascript')
      return
    }
    const name = url.pathname.slice(1)
    let bytes = files.get(name)
    assert(bytes, 'Unknown fixture resource')
    if (name === 'child.html') {
      const core = url.searchParams.get('core')
      assert(cores.has(core), 'Unknown child core')
      bytes = Buffer.from(bytes.toString().replace('__CORE__', core))
    }
    send(req, res, bytes, name.endsWith('.js') ? 'text/javascript' : name.endsWith('.mp4') ? 'video/mp4' : 'text/html')
  }
  catch (error) { res.writeHead(400, { 'Content-Type': 'text/plain' }).end(error.message) }
})
server.listen(port, '127.0.0.1', () => process.stdout.write(`Iframe history server: ${port}\n`))
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.closeAllConnections()
    server.close()
  })
}
