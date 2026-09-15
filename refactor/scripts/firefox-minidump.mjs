import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

// Read only exception/module/thread-name metadata; this is not a stack unwinder.
export function inspectFirefoxMinidump(bytes) {
  const region = (offset, size) => {
    assert(Number.isSafeInteger(offset) && Number.isSafeInteger(size) && offset >= 0 && size >= 0 && offset + size <= bytes.length, 'Truncated minidump region')
    return bytes.subarray(offset, offset + size)
  }
  const u32 = offset => region(offset, 4).readUInt32LE()
  const u64 = offset => region(offset, 8).readBigUInt64LE()
  const hex = value => `0x${value.toString(16)}`
  const string = (offset) => {
    const size = u32(offset)
    assert.equal(size % 2, 0, 'Invalid UTF-16 minidump string')
    return region(offset + 4, size).toString('utf16le')
  }
  assert.equal(region(0, 4).toString('ascii'), 'MDMP', 'Invalid minidump signature')
  const count = u32(8)
  assert(count <= 4096, 'Excessive minidump stream count')
  const streams = Array.from({ length: count }, (_, i) => {
    const at = u32(12) + i * 12
    const stream = { type: u32(at), size: u32(at + 4), rva: u32(at + 8) }
    region(stream.rva, stream.size)
    return stream
  })
  const stream = (type, minimum) => {
    const matches = streams.filter(item => item.type === type)
    assert(matches.length === 1 && matches[0].size >= minimum, `Missing, duplicated or truncated stream ${type}`)
    return matches[0]
  }
  const exceptionStream = stream(6, 168)
  const e = exceptionStream.rva
  const parameters = u32(e + 32)
  assert(parameters <= 15, 'Invalid exception parameter count')
  const exception = { threadId: u32(e), code: hex(u32(e + 8)), flags: u32(e + 12), address: hex(u64(e + 24)), parameters: Array.from({ length: parameters }, (_, i) => hex(u64(e + 40 + i * 8))) }
  const moduleStream = stream(4, 4)
  const moduleCount = u32(moduleStream.rva)
  assert(moduleCount * 108 + 4 <= moduleStream.size, 'Truncated module list')
  const modules = Array.from({ length: moduleCount }, (_, i) => {
    const at = moduleStream.rva + 4 + 108 * i
    return { name: string(u32(at + 20)), base: hex(u64(at)), size: u32(at + 8), codeView: region(u32(at + 80), u32(at + 76)).toString('hex') }
  })
  const faultModule = modules.find(module => BigInt(module.base) <= BigInt(exception.address) && BigInt(exception.address) < BigInt(module.base) + BigInt(module.size))
  let threadName
  if (streams.some(item => item.type === 24)) {
    const names = stream(24, 4)
    const count = u32(names.rva)
    assert(count * 12 + 4 <= names.size, 'Truncated thread name list')
    for (let i = 0; i < count; i++) {
      const at = names.rva + 4 + i * 12
      if (u32(at) === exception.threadId)
        threadName = string(Number(u64(at + 4)))
    }
  }
  return { exception, threadName, faultModule, moduleOffset: faultModule && hex(BigInt(exception.address) - BigInt(faultModule.base)), moduleCount, stackResolved: false }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.argv.length, 3, 'Usage: node refactor/scripts/firefox-minidump.mjs <dump>')
  console.log(JSON.stringify(inspectFirefoxMinidump(fs.readFileSync(process.argv[2])), null, 2))
}
