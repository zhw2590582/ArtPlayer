import assert from 'node:assert/strict'
import { hash } from './provenance.ts'

export interface EmbeddedNotice {
  archive: string
  member: string
  memberSha256: string
  mapSource?: string
  sourceSha256: string
  start: string
  end: string
  source: string
  sha256: string
}

export function extractNotice(bytes: Uint8Array, notice: EmbeddedNotice): string {
  assert.equal(hash(bytes), notice.memberSha256, 'Embedded notice archive member changed')
  let source = new TextDecoder().decode(bytes)
  if (notice.mapSource) {
    const map: { sources: string[], sourcesContent: (string | null)[] } = JSON.parse(source)
    const indices = map.sources.flatMap((name, index) => name === notice.mapSource ? [index] : [])
    assert.equal(indices.length, 1, 'Missing or duplicate embedded notice map source')
    const content = map.sourcesContent[indices[0]!]
    assert.equal(typeof content, 'string', 'Missing embedded notice source content')
    source = content!
  }
  assert.equal(hash(source), notice.sourceSha256, 'Embedded notice source changed')
  const start = source.indexOf(notice.start)
  assert(start >= 0 && !source.includes(notice.start, start + 1), 'Missing or duplicate notice start')
  const end = source.indexOf(notice.end, start)
  assert(end >= start, 'Missing notice end')
  const text = source.slice(start, end + notice.end.length)
  assert.equal(hash(text), notice.sha256, 'Embedded notice excerpt changed')
  return text
}
