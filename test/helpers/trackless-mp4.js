import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'

// Derive a trackless container from the small, repository-owned MP4 fixture.
export function tracklessMp4(bytes) {
  function boxes(bytes) {
    const result = []
    let offset = 0
    while (offset < bytes.length) {
      assert(offset + 8 <= bytes.length)
      const size = bytes.readUInt32BE(offset)
      assert(size >= 8 && offset + size <= bytes.length, 'Fixture requires bounded 32-bit boxes')
      result.push({ type: bytes.toString('ascii', offset + 4, offset + 8), bytes: bytes.subarray(offset, offset + size) })
      offset += size
    }
    return result
  }
  const top = boxes(bytes)
  const ftyp = top.find(box => box.type === 'ftyp')
  const moov = top.find(box => box.type === 'moov')
  assert(ftyp && moov)
  const children = boxes(moov.bytes.subarray(8))
  assert(children.some(box => box.type === 'trak'))
  const body = Buffer.concat(children.filter(box => box.type !== 'trak').map(box => box.bytes))
  const header = Buffer.alloc(8)
  header.writeUInt32BE(body.length + 8)
  header.write('moov', 4)
  return Buffer.concat([ftyp.bytes, header, body])
}
