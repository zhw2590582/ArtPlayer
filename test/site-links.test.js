import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Exercise the generated site's real filesystem and HTML links.
import test from 'node:test'
import { checkSiteLinks } from '../scripts/site-build/links.ts'

async function fixture(t, lookup = { a: { l: 'target.html#中文' } }) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'artplayer-site-links-'))
  t.after(async () => {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()))
    assert(path.basename(root).startsWith('artplayer-site-links-'))
    await fs.rm(root, { recursive: true, force: true })
  })
  await fs.mkdir(path.join(root, 'document/assets/chunks'), { recursive: true })
  await fs.writeFile(path.join(root, 'package.json'), '{"type":"module"}')
  await fs.writeFile(path.join(root, 'document/assets/chunks/virtual_search-data.test.js'), `export default ${JSON.stringify({ PREVIEW_LOOKUP: lookup })}`)
  await fs.writeFile(path.join(root, 'document/index.html'), '<a href="target.html#%E4%B8%AD%E6%96%87">target</a><a href="https://example.com/unchecked">external</a><a href="mailto:test@example.com">email</a>')
  await fs.writeFile(path.join(root, 'document/target.html'), '<h1 id="中文">Heading</h1><a name="legacy"></a><a href="#legacy">legacy</a><a href="/document/">home</a><img src="/image.svg?v=1"><script src="/script.js"></script><h2 id="a&amp;b">Entity</h2><a href="#a%26b">entity</a><script>const html = \'<a href="/not-a-link">\';</script><template><a href="/inert">inert</a></template>')
  await fs.writeFile(path.join(root, 'image.svg'), '<svg/>')
  await fs.writeFile(path.join(root, 'script.js'), '')
  return root
}

test('built pages and the shipped search index resolve encoded anchors, assets and directory URLs', async (t) => {
  const report = await checkSiteLinks(await fixture(t))
  assert.equal(report.pages, 2)
  assert.equal(report.searchEntries, 1)
  assert.equal(report.localReferences, 7)
  assert.deepEqual(report.externalUrls, ['https://example.com/unchecked'])
  assert.deepEqual(report.issues, [])
})

test('broken assets, ordinary anchors and actual search-index anchors fail independently', async (t) => {
  const root = await fixture(t, { a: { l: 'target.html#absent' }, b: { l: 'missing.html' } })
  await fs.appendFile(path.join(root, 'document/index.html'), '<a href="target.html#missing">bad</a><img src="/missing.svg"><a href="/%ZZ">invalid</a>')
  const report = await checkSiteLinks(root)
  assert.equal(report.pageIssues, 3)
  assert.equal(report.searchIssues, 2)
  assert(report.issues.some(issue => issue.source === 'search:a' && issue.reason.includes('Missing anchor')))
  assert(report.issues.some(issue => issue.source === 'search:b' && issue.reason === 'Missing local file'))
})

test('missing, ambiguous or malformed search modules cannot silently pass', async (t) => {
  const root = await fixture(t, { a: {} })
  await assert.rejects(checkSiteLinks(root), /Missing search URL/)
  const chunks = path.join(root, 'document/assets/chunks')
  await fs.copyFile(path.join(chunks, 'virtual_search-data.test.js'), path.join(chunks, 'virtual_search-data.extra.js'))
  await assert.rejects(checkSiteLinks(root), /exactly one/)
  await fs.unlink(path.join(chunks, 'virtual_search-data.extra.js'))
  await fs.unlink(path.join(chunks, 'virtual_search-data.test.js'))
  await assert.rejects(checkSiteLinks(root), /exactly one/)
})
