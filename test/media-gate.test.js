import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Test the real local HTTP fixture with Node's runner.
import test from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { createMediaGate } from './helpers/media-gate.js'

test('media gate completes a bounded range and withholds the rest without altering bytes', async () => {
  const bytes = Buffer.from('0123456789abcdef')
  const gate = await createMediaGate(bytes, 'audio/mp4', 5, true)
  try {
    const first = await fetch(gate.url, { headers: { Range: 'bytes=0-' }, signal: AbortSignal.timeout(2000) })
    assert.equal(first.status, 206)
    assert.equal(first.headers.get('Content-Range'), 'bytes 0-4/16')
    assert.equal(first.headers.get('Content-Length'), '5')
    assert.deepEqual(Buffer.from(await first.arrayBuffer()), bytes.subarray(0, 5))
    const tail = await fetch(gate.url, { headers: { Range: 'bytes=5-' }, signal: AbortSignal.timeout(2000) })
    assert.equal(tail.status, 206)
    assert.equal(tail.headers.get('ETag'), first.headers.get('ETag'))
    assert.equal(gate.blocked, 1)
    let finished = false
    const remaining = tail.arrayBuffer().then((body) => {
      finished = true
      return Buffer.from(body)
    })
    await setImmediate()
    assert.equal(finished, false)
    gate.release()
    assert.deepEqual(await remaining, bytes.subarray(5))
    assert.equal(gate.blocked, 0)
    assert(gate.requests.some(request => request.wasHeld))
  }
  finally {
    await gate.close()
  }
})

test('media gate streams a prefix within a full declared response and releases the remaining bytes', async () => {
  const bytes = Buffer.from('0123456789abcdef')
  const gate = await createMediaGate(bytes, 'audio/mp4', 5)
  try {
    const response = await fetch(gate.url, { headers: { Range: 'bytes=0-' }, signal: AbortSignal.timeout(2000) })
    assert.equal(response.headers.get('Content-Range'), 'bytes 0-15/16')
    assert.equal(response.headers.get('Content-Length'), '16')
    const reader = response.body.getReader()
    const first = await reader.read()
    assert.deepEqual(Buffer.from(first.value), bytes.subarray(0, 5))
    let finished = false
    const tail = reader.read().then((value) => {
      finished = true
      return value
    })
    await setImmediate()
    assert.equal(finished, false)
    assert.equal(gate.blocked, 1)
    gate.release()
    assert.deepEqual(Buffer.from((await tail).value), bytes.subarray(5))
    assert.equal((await reader.read()).done, true)
  }
  finally {
    await gate.close()
  }
})

test('media gate preserves HEAD and rejects invalid ranges before serving the released suffix', async () => {
  const gate = await createMediaGate(Buffer.from('0123456789'), 'video/mp4', 4)
  try {
    const head = await fetch(gate.url, { method: 'HEAD' })
    assert.equal(head.status, 200)
    assert.equal(head.headers.get('Content-Length'), '10')
    assert.equal(await head.text(), '')
    assert.equal(gate.blocked, 0)
    const invalid = await fetch(gate.url, { headers: { Range: 'bytes=20-' } })
    assert.equal(invalid.status, 416)
    assert.equal(invalid.headers.get('Content-Range'), 'bytes */10')
    gate.release()
    const suffix = await fetch(gate.url, { headers: { Range: 'bytes=-3' } })
    assert.equal(suffix.headers.get('Content-Range'), 'bytes 7-9/10')
    assert.equal(await suffix.text(), '789')
  }
  finally {
    await gate.close()
  }
})
