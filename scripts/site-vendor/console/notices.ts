import type { VendorManifest } from '../notices.ts'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

interface Notice { source: string, sha256: string }
interface Archive { name: string, version: string, tarball: string, notices: Notice[] }
interface Remote extends Notice { id: string, url: string }

// Bind delivered component notices to independently verified source records.
// The normal site build does not download or execute the historical compilers.
export function verifyConsoleNoticeSources(root: string, manifest: VendorManifest): { components: number, upstreamNotices: number } {
  const read = <T>(name: string): T => JSON.parse(fs.readFileSync(path.join(root, `refactor/baselines/${name}.json`), 'utf8')) as T
  const feed = read<{ archive: Archive, notice: Notice }>('console-feed-provenance')
  const common = read<{ archives: Archive[] }>('console-commonjs-provenance')
  const esm = read<{ archives: Archive[], parcel: { archive: Archive, notices: Notice[] }, supplementalNotices: Notice[] }>('console-esm-provenance')
  const embedded = read<{ archives: Archive[] }>('console-embedded-sources')
  const headers = read<{ notices: Notice[] }>('console-embedded-notices')
  const derived = read<{ archives: Archive[], remotes: Remote[], hash: { notice: Notice }, shallow: { license: string } }>('console-derived-attribution')
  const stack = read<{ apiUrl: string, notices: Notice[] }>('console-stackoverflow-provenance')
  const group = manifest.groups.find(group => group.name === 'console')
  assert(group?.components, 'Missing console component inventory')
  const visited = new Set<string>()
  const matchedNotices = new Set<string>()
  const verify = (identity: { name: string, tarball?: string }, expected: Notice[]): void => {
    const matches = group.components!.filter(component => component.name === identity.name && (!identity.tarball || component.tarball === identity.tarball))
    assert.equal(matches.length, 1, 'Expected one component for verified console source')
    const component = matches[0]!
    assert(!visited.has(component.name), 'Duplicate console source coverage')
    assert(expected.length, `Missing source license: ${component.name}`)
    for (const notice of expected) {
      const delivered: (Notice & { target: string })[] = group.notices.filter(item => item.source === notice.source && item.sha256 === notice.sha256)
      assert.equal(delivered.length, 1, `Console source notice not delivered: ${component.name}`)
      assert(component.notices.includes(delivered[0]!.target), `Console component points to the wrong notice: ${component.name}`)
      matchedNotices.add(delivered[0]!.target)
    }
    visited.add(component.name)
  }
  verify(feed.archive, [feed.notice])
  for (const archive of [...common.archives, ...esm.archives, ...embedded.archives, ...derived.archives]) {
    const name = archive.name === '@babel/runtime' && archive.version === '7.13.10'
      ? '@babel/runtime (react-inspector embedded)'
      : archive.name === 'replicator'
        ? 'replicator (console-feed fork)'
        : archive.name === 'stylis' ? 'stylis (Emotion fork)' : archive.name
    verify({ name, tarball: archive.tarball }, archive.name === 'styled-components' ? esm.supplementalNotices : archive.notices)
  }
  verify(esm.parcel.archive, esm.parcel.notices)
  assert.equal(headers.notices.length, 2, 'Unexpected embedded header scope')
  verify({ name: 'chromium-string-utils' }, [headers.notices[0]!])
  verify({ name: 'stylis-rule-sheet' }, [headers.notices[1]!])
  const hashLicense = derived.remotes.find(source => source.id === 'gary-readme')
  assert(hashLicense, 'Missing MurmurHash license source')
  verify({ name: 'murmurhash-js (Gary Court)' }, [hashLicense])
  verify({ name: 'murmurhash2 (Austin Appleby)' }, [derived.hash.notice])
  verify({ name: 'stackoverflow-custom-stringify', tarball: stack.apiUrl }, stack.notices)
  const pureLicense = derived.remotes.find(source => source.id === derived.shallow.license)
  assert(pureLicense, 'Missing react-pure-render license source')
  verify({ name: 'react-pure-render (shallowequal origin)' }, [pureLicense])
  assert.equal(visited.size, 44, 'Incomplete reviewed console source scope')
  assert.deepEqual([...visited].sort(), group.components.map(component => component.name).sort(), 'Unreviewed console component')
  return { components: visited.size, upstreamNotices: matchedNotices.size }
}
