import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { EventEmitter, once } from 'node:events'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Verify real HTTP, shutdown and startup failure ownership.
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'
import { startDevelopment } from '../scripts/library/development.ts'
import { createReloadChannel } from '../scripts/library/reload.ts'
import { startDevServer } from '../scripts/library/server.ts'

const repository = fileURLToPath(new URL('../', import.meta.url))
const cache = path.join(repository, 'refactor/.cache')
const cleanup = new WeakMap()

function fixture(t) {
  cleanup.set(t, [])
  const root = fs.mkdtempSync(path.join(cache, 'dev-server-'))
  fs.mkdirSync(path.join(root, 'docs'))
  fs.writeFileSync(path.join(root, 'docs/index.html'), '<!doctype html><title>Home</title>首页')
  const project = path.join(root, 'packages/artplayer-plugin-probe')
  fs.mkdirSync(path.join(project, 'src'), { recursive: true })
  fs.writeFileSync(path.join(project, 'package.json'), '{"name":"artplayer-plugin-probe","version":"1.0.0"}')
  fs.writeFileSync(path.join(project, 'src/index.ts'), 'export default () => 42')
  t.after(async () => {
    for (const close of cleanup.get(t).reverse())
      await close()
    assert.equal(fs.realpathSync(root), root)
    assert.equal(path.dirname(root), fs.realpathSync(cache))
    fs.rmSync(root, { recursive: true, force: true })
  })
  return { root, docs: path.join(root, 'docs'), project }
}

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('error', reject)
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }))
    })
    req.on('error', reject)
    req.end()
  })
}

async function server(t, docs) {
  const failures = []
  const service = await startDevServer({ root: docs, port: 0, onError: error => failures.push(error) })
  cleanup.get(t).push(async () => {
    await service.close()
    assert.deepEqual(failures, [])
  })
  return service
}

test('static pages, fallback, directory indexes, gzip negotiation and HEAD preserve actual content', async (t) => {
  const { docs } = fixture(t)
  fs.writeFileSync(path.join(docs, 'module.js'), 'window.label = "中文";')
  fs.writeFileSync(path.join(docs, 'empty.css'), '')
  fs.mkdirSync(path.join(docs, 'document'))
  fs.writeFileSync(path.join(docs, 'document/index.html'), '<h1>Docs</h1>')
  const { url } = await server(t, docs)
  const home = await request(url, { headers: { 'Accept-Encoding': 'gzip' } })
  assert.equal(home.status, 200)
  assert.equal(home.headers['content-encoding'], 'gzip')
  assert.match(gunzipSync(home.body).toString(), /首页/)
  assert.match(gunzipSync(home.body).toString(), /EventSource\('\/livereload'\)/)
  const identity = await request(`${url}/module.js`, { headers: { 'Accept-Encoding': 'gzip;q=0, *;q=1' } })
  assert.equal(identity.headers['content-encoding'], undefined)
  assert.equal(identity.body.toString(), 'window.label = "中文";')
  const zipped = await request(`${url}/module.js`, { headers: { 'Accept-Encoding': 'gzip' } })
  assert.equal(gunzipSync(zipped.body).toString(), identity.body.toString())
  const head = await request(`${url}/module.js`, { method: 'HEAD' })
  assert.equal(Number(head.headers['content-length']), identity.body.length)
  assert.equal(head.body.length, 0)
  const empty = await request(`${url}/empty.css`, { headers: { 'Accept-Encoding': 'gzip' } })
  assert.equal(empty.body.length, 0)
  assert.equal(empty.headers['content-encoding'], undefined)
  assert.equal((await request(`${url}/document?language=en`)).headers.location, '/document/?language=en')
  assert.match((await request(`${url}/document/`)).body.toString(), /<h1>Docs/)
  assert.match((await request(`${url}/unknown-route`)).body.toString(), /首页/)
  assert.equal((await request(`${url}/missing.js`)).status, 404)
  assert.equal((await request(url, { method: 'POST' })).status, 405)
  assert.equal((await request(url, { method: 'OPTIONS' })).headers['access-control-allow-origin'], '*')
})

test('media ranges support exact zero, bounded, suffix, open-ended and unsatisfiable requests', async (t) => {
  const { docs } = fixture(t)
  fs.writeFileSync(path.join(docs, 'media.mp4'), '0123456789')
  const { url } = await server(t, docs)
  for (const [range, body, contentRange] of [
    ['bytes=0-0', '0', 'bytes 0-0/10'],
    ['bytes=2-5', '2345', 'bytes 2-5/10'],
    ['bytes=7-999', '789', 'bytes 7-9/10'],
    ['bytes=-3', '789', 'bytes 7-9/10'],
    ['bytes=8-', '89', 'bytes 8-9/10'],
  ]) {
    const response = await request(`${url}/media.mp4`, { headers: { 'Range': range, 'Accept-Encoding': 'gzip' } })
    assert.equal(response.status, 206)
    assert.equal(response.body.toString(), body)
    assert.equal(response.headers['content-range'], contentRange)
    assert.equal(response.headers['content-encoding'], undefined)
  }
  for (const range of ['bytes=10-', 'bytes=5-2', 'bytes=-0', 'bytes=1-2,5-7', 'bytes=-', 'invalid']) {
    const response = await request(`${url}/media.mp4`, { headers: { Range: range } })
    assert.equal(response.status, 416)
    assert.equal(response.headers['content-range'], 'bytes */10')
  }
})

test('malformed paths and symlink escapes never serve files outside the docs root', async (t) => {
  const { root, docs } = fixture(t)
  fs.mkdirSync(path.join(root, 'private'))
  fs.writeFileSync(path.join(root, 'private/secret.txt'), 'private sentinel')
  fs.symlinkSync(path.join(root, 'private'), path.join(docs, 'outside'), 'junction')
  const { url } = await server(t, docs)
  assert.equal((await request(`${url}/outside/secret.txt`)).status, 403)
  assert.equal((await request(`${url}/%2e%2e%2fprivate/secret.txt`)).status, 403)
  assert.equal((await request(`${url}/%E0%A4%A`)).status, 400)
  fs.unlinkSync(path.join(docs, 'outside'))
})

test('an occupied port rejects and the real CLI exits nonzero without stopping the existing service', async (t) => {
  const { root, docs } = fixture(t)
  const service = await server(t, docs)
  const port = Number(new URL(service.url).port)
  await assert.rejects(startDevServer({ root: docs, port, onError() {} }), { code: 'EADDRINUSE' })
  const result = spawnSync(process.execPath, [path.join(repository, 'scripts/dev.js'), 'artplayer-plugin-probe', '--no-open'], { cwd: root, env: { ...process.env, ARTPLAYER_DEV_PORT: String(port) }, encoding: 'utf8', timeout: 10000 })
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /EADDRINUSE/)
  assert.equal((await request(service.url)).status, 200)
  const invalid = spawnSync(process.execPath, [path.join(repository, 'scripts/dev.js'), '--help'], { cwd: root, env: { ...process.env, ARTPLAYER_DEV_PORT: 'invalid' }, encoding: 'utf8', timeout: 10000 })
  assert.equal(invalid.status, 1)
  assert.match(invalid.stderr, /ARTPLAYER_DEV_PORT/)
})

test('SSE clients and HTTP sockets close before the same port is reused repeatedly', async (t) => {
  const { docs } = fixture(t)
  let port = 0
  for (let index = 0; index < 3; index++) {
    const service = await startDevServer({ root: docs, port, onError: error => assert.fail(error) })
    cleanup.get(t).push(() => service.close())
    port = Number(new URL(service.url).port)
    const client = http.get(`${service.url}/livereload`)
    const [response] = await once(client, 'response')
    response.on('error', () => {})
    const [connected] = await once(response, 'data')
    assert.match(connected.toString(), /event: connected/)
    service.reload()
    const [reload] = await once(response, 'data')
    assert.match(reload.toString(), /data: reload/)
    const disconnected = new Promise(resolve => response.once('close', resolve))
    const close = service.close()
    assert.equal(service.close(), close)
    await Promise.all([close, disconnected])
  }
})

test('disconnecting a large download does not retain a stream or block shutdown', async (t) => {
  const { docs } = fixture(t)
  const large = path.join(docs, 'large.bin')
  fs.closeSync(fs.openSync(large, 'w'))
  fs.truncateSync(large, 16 * 1024 * 1024)
  const service = await server(t, docs)
  const client = http.get(`${service.url}/large.bin`)
  const [response] = await once(client, 'response')
  response.on('error', () => {})
  await once(response, 'data')
  client.destroy()
  await service.close()
  fs.unlinkSync(large)
})

test('development close settles a running build and abort during startup cannot leave a listening server', async (t) => {
  const { root, project } = fixture(t)
  const session = await startDevelopment(project, 'artplayer-plugin-probe', false, { root, port: 0 })
  await session.close()
  await session.done
  await assert.rejects(request(session.url), { code: 'ECONNREFUSED' })
  const abort = new AbortController()
  const starting = startDevelopment(project, 'artplayer-plugin-probe', false, { root, port: 0, signal: abort.signal })
  abort.abort()
  const aborted = await starting
  await aborted.done
  await assert.rejects(request(aborted.url), { code: 'ECONNREFUSED' })
  await assert.rejects(startDevelopment(path.join(root, 'missing'), 'missing', false, { root, port: 0 }), { code: 'ENOENT' })
})

test('reload heartbeats share one clock and stop after disconnection or channel shutdown', (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] })
  class Response extends EventEmitter {
    writes = []
    writeHead(status) {
      this.status = status
      return this
    }

    write(value) {
      this.writes.push(value)
    }

    end() {
      this.emit('close')
    }
  }
  const channel = createReloadChannel()
  const first = new Response()
  const second = new Response()
  channel.add(first)
  channel.add(second)
  t.mock.timers.tick(30000)
  assert.equal(first.writes.length, 2)
  assert.equal(second.writes.length, 2)
  first.emit('close')
  t.mock.timers.tick(30000)
  assert.equal(first.writes.length, 2)
  assert.equal(second.writes.length, 3)
  channel.close()
  t.mock.timers.tick(90000)
  channel.reload()
  assert.equal(second.writes.length, 3)
  const late = new Response()
  channel.add(late)
  assert.equal(late.status, 503)
  assert.deepEqual(late.writes, [])
})
