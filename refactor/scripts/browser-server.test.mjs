import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { hash, refactorDir } from './releases.mjs'

test('baseline host serves exact release bytes, media ranges and isolated routes', { timeout: 15000 }, async () => {
  const child = spawn(process.execPath, [path.join(refactorDir, 'scripts/browser-server.mjs')], {
    env: { ...process.env, ARTPLAYER_TEST_PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
  })
  let timer
  try {
    const origin = await new Promise((resolve, reject) => {
      let output = ''
      timer = setTimeout(() => reject(new Error('Host did not start')), 10000)
      child.once('error', reject)
      child.once('exit', code => reject(new Error(`Host exited: ${code}`)))
      child.stdout.on('data', (chunk) => {
        output += chunk
        const match = output.match(/http:\/\/127\.0\.0\.1:\d+/)
        if (match) { clearTimeout(timer); resolve(match[0]) }
      })
    })
    const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8'))
    const response = await fetch(`${origin}/releases/artplayer/dist/artplayer.js`)
    assert.equal(response.status, 200)
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), baseline.releases[0].files['package/dist/artplayer.js'])
    const html = await fetch(`${origin}/fixtures/api.html`)
    assert.equal(html.status, 200)
    assert((await html.text()).includes('/releases/artplayer-plugin-chapter/'))
    const media = fs.readFileSync(path.resolve(refactorDir, '../docs/assets/sample/video.mp4'))
    const range = await fetch(`${origin}/assets/sample/video.mp4`, { headers: { Range: 'bytes=0-31' } })
    assert.equal(range.status, 206)
    assert.equal(range.headers.get('content-range'), `bytes 0-31/${media.length}`)
    assert.deepEqual(Buffer.from(await range.arrayBuffer()), media.subarray(0, 32))
    const invalid = await fetch(`${origin}/assets/sample/video.mp4`, { headers: { Range: `bytes=${media.length}-` } })
    assert.equal(invalid.status, 416)
    assert.equal((await fetch(`${origin}/fixtures/%2e%2e%2fbaselines/releases.json`)).status, 400)
    assert.equal((await fetch(`${origin}/releases/artplayer/no-such-member.js`)).status, 400)
    assert.equal((await fetch(`${origin}/reports/api`, { method: 'POST', headers: { Origin: 'https://example.com' }, body: '{}' })).status, 400)
  }
  finally {
    clearTimeout(timer)
    const exited = once(child, 'exit')
    child.kill()
    await exited
  }
})
