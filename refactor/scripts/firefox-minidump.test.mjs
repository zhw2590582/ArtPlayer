import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Exercise binary diagnostic metadata without requiring a real browser crash.
import { test } from 'node:test'
import { inspectFirefoxMinidump } from './firefox-minidump.mjs'

function fixture() {
  const bytes = Buffer.alloc(512)
  bytes.write('MDMP')
  bytes.writeUInt32LE(3, 8)
  bytes.writeUInt32LE(32, 12)
  for (const [i, type, size, rva] of [[0, 6, 168, 80], [1, 4, 112, 248], [2, 24, 16, 360]]) {
    bytes.writeUInt32LE(type, 32 + i * 12)
    bytes.writeUInt32LE(size, 36 + i * 12)
    bytes.writeUInt32LE(rva, 40 + i * 12)
  }
  bytes.writeUInt32LE(123, 80)
  bytes.writeUInt32LE(0xC0000005, 88)
  bytes.writeBigUInt64LE(0x10000000008n, 104)
  bytes.writeUInt32LE(2, 112)
  bytes.writeBigUInt64LE(8n, 128)
  bytes.writeUInt32LE(1, 248)
  bytes.writeBigUInt64LE(0x10000000000n, 252)
  bytes.writeUInt32LE(1024, 260)
  bytes.writeUInt32LE(380, 272)
  bytes.writeUInt32LE(14, 380)
  bytes.write('xul.dll', 384, 'utf16le')
  bytes.writeUInt32LE(1, 360)
  bytes.writeUInt32LE(123, 364)
  bytes.writeBigUInt64LE(410n, 368)
  bytes.writeUInt32LE(20, 410)
  bytes.write('DOM Worker', 414, 'utf16le')
  return bytes
}

test('exception metadata identifies the module and thread without inventing a stack', () => {
  const result = inspectFirefoxMinidump(fixture())
  assert.equal(result.exception.code, '0xc0000005')
  assert.deepEqual(result.exception.parameters, ['0x0', '0x8'])
  assert.equal(result.faultModule.name, 'xul.dll')
  assert.equal(result.moduleOffset, '0x8')
  assert.equal(result.threadName, 'DOM Worker')
  assert.equal(result.stackResolved, false)
})

test('invalid binary regions, counts and encoding are rejected', () => {
  assert.throws(() => inspectFirefoxMinidump(Buffer.alloc(4)), /signature/)
  assert.throws(() => inspectFirefoxMinidump(fixture().subarray(0, 100)), /Truncated/)
  for (const [offset, value, message] of [[8, 5000, /stream count/], [112, 16, /parameter count/], [248, 1000, /module list/], [360, 1000, /thread name list/], [380, 15, /UTF-16/]]) {
    const bytes = fixture()
    bytes.writeUInt32LE(value, offset)
    assert.throws(() => inspectFirefoxMinidump(bytes), message)
  }
})

test('addresses outside all module ranges remain unattributed', () => {
  const bytes = fixture()
  bytes.writeBigUInt64LE(8n, 104)
  assert.equal(inspectFirefoxMinidump(bytes).faultModule, undefined)
})
