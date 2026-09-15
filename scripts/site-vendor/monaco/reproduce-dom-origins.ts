import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ArchiveCache } from './archives.ts'
import { domOriginFragments, readDomOrigins, verifyMonacoDomNotices } from './dom-origins.ts'

const root = fileURLToPath(new URL('../../../', import.meta.url))
assert(process.argv.slice(2).every(arg => arg === '--fetch'), 'Use reproduce-dom-origins.ts [--fetch]')
assert.equal(process.version, `v${fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim()}`, 'Use canonical Node')
const record = readDomOrigins(root)
const cache = new ArchiveCache(root, path.join(root, 'refactor/.cache/monaco-review'))
await cache.verify(record.archives, record.remotes, process.argv.includes('--fetch'))
verifyMonacoDomNotices(root, JSON.parse(fs.readFileSync(path.join(root, 'scripts/site-vendor/manifest.json'), 'utf8')))
const map: { sources: string[], sourcesContent: string[] } = JSON.parse(cache.member(record.map).toString('utf8'))
assert.equal(map.sources.filter(source => source === record.map.source).length, 1, 'Missing or repeated DOM source map entry')
const mapped = domOriginFragments(map.sourcesContent[map.sources.indexOf(record.map.source)]!)
const original = domOriginFragments(fs.readFileSync(path.join(root, record.vscodeSource), 'utf8'))
assert.deepEqual(mapped, original, 'Prepared DOM adaptations differ from fixed VS Code source')
assert.deepEqual(fs.readFileSync(path.join(root, record.shipped.target)), cache.member(record.shipped), 'Shipped DOM asset changed')
const winjs = fs.readFileSync(path.join(root, record.winjsSource), 'utf8')
for (const name of ['convertToPixels', 'getDimension', 'getTotalWidth', 'getContentWidth', 'getContentHeight', 'getTotalHeight', 'getPosition'])
  assert(winjs.includes(name), 'Missing referenced WinJS helper')
console.log(JSON.stringify({ archives: record.archives.length, gitSources: record.remotes.length, unchangedMappedAdaptations: mapped.size, shippedAssetMatchesArchive: true, originalWinjsVersion: null, referenceVersion: '4.4.5', fullDomCompilation: false }))
