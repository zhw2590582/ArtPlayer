import assert from 'node:assert/strict'
import { hash } from './provenance.ts'

export interface Member { archive: string, member: string, sha256: string }
export interface MappedSource { path: string, upstream: Member }
export interface SourceMapRecord { source: Member, externalPrefix: string, sources: MappedSource[] }
export interface TransformedSource { source: Member, target: Member }
export type ReadMember = (source: Member) => Uint8Array

function verified(source: Member, read: ReadMember): string {
  const bytes = read(source)
  assert.equal(hash(bytes), source.sha256, `Embedded source member changed: ${source.archive}/${source.member}`)
  return new TextDecoder().decode(bytes)
}

export function verifyMappedSources(record: SourceMapRecord, read: ReadMember): number {
  const map: { sources: string[], sourcesContent: (string | null)[] } = JSON.parse(verified(record.source, read))
  assert(record.externalPrefix.length > 0 && record.sources.length > 0, 'Empty embedded source scope')
  const expected = record.sources.map(source => source.path)
  assert.equal(new Set(expected).size, expected.length, 'Duplicate embedded source mapping')
  assert.deepEqual(map.sources.filter(source => source.startsWith(record.externalPrefix)).sort(), expected.slice().sort(), 'Embedded source map inventory changed')
  for (const source of record.sources) {
    const index = map.sources.indexOf(source.path)
    assert.equal(map.sourcesContent[index], verified(source.upstream, read), `Embedded source content differs: ${source.path}`)
  }
  return record.sources.length
}

export function verifyTransformedSources(sources: TransformedSource[], read: ReadMember, transform: (source: string) => string): number {
  assert(sources.length > 0, 'Empty transformed source scope')
  assert.equal(new Set(sources.map(source => `${source.target.archive}/${source.target.member}`)).size, sources.length, 'Duplicate transformed source target')
  for (const source of sources)
    assert.equal(transform(verified(source.source, read)), verified(source.target, read), `Embedded source transform differs: ${source.target.member}`)
  return sources.length
}
