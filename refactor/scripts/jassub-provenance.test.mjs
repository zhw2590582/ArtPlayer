import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Provenance checks use the repository runner.
import test from 'node:test'

const args = process.argv.slice(2)
for (const value of args)
  assert(['--network', '--cached-evidence'].includes(value) || value.startsWith('--provenance='), `unknown provenance argument: ${value}`)
const filename = args.find(value => value.startsWith('--provenance='))?.slice('--provenance='.length)
  ?? 'refactor/baselines/jassub-provenance.json'
const provenance = readJson(filename)
const cache = 'refactor/.cache'
const network = args.includes('--network')
const cachedEvidence = args.includes('--cached-evidence')

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function digest(bytes, algorithm = 'sha256') {
  return createHash(algorithm).update(bytes).digest('hex')
}

function gitBlob(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
}

function verifyBytes(bytes, expected, label) {
  assert.equal(bytes.length, expected.bytes, `${label}: bytes`)
  assert.equal(digest(bytes), expected.sha256, `${label}: SHA-256`)
  assert.equal(gitBlob(bytes), expected.gitBlob, `${label}: Git blob SHA-1`)
}

function verifyTreeEntry(tree, file, expected) {
  assert.equal(tree.truncated, false, 'an incomplete tree cannot prove path identity')
  const entry = tree.tree.find(item => item.path === file)
  assert(entry, `upstream tree is missing ${file}`)
  assert.equal(entry.type, 'blob', file)
  assert.equal(entry.sha, expected.gitBlob, file)
  assert.equal(entry.size, expected.bytes, file)
}

function verifyLineage(pagesCommit, nightlyCommit, pagesTree, sourceTree) {
  const { pagesSnapshot, wasmNightly, build } = provenance.upstream
  assert.equal(pagesCommit.sha, pagesSnapshot.commit)
  assert.equal(pagesCommit.commit.message, pagesSnapshot.message)
  assert(pagesCommit.commit.message.includes(`From ${pagesSnapshot.sourceCommit}`))
  assert.deepEqual(pagesCommit.files.map(item => item.filename), pagesSnapshot.changedPaths)
  assert.equal(nightlyCommit.sha, wasmNightly.commit)
  assert.equal(nightlyCommit.commit.message, wasmNightly.message)
  assert(nightlyCommit.commit.message.includes(`From ${build.sourceCommit}`))
  assert.equal(wasmNightly.sourceCommit, build.sourceCommit, 'artifact source revision must match build source')
  assert.equal(pagesTree.sha, pagesSnapshot.tree)
  assert.equal(sourceTree.sha, build.tree)
  assert.equal(sourceTree.truncated, false)
  for (const item of provenance.assets) {
    assert.equal(item.upstream.commit, pagesSnapshot.commit)
    for (const file of item.upstream.paths) verifyTreeEntry(pagesTree, file, item)
    if (item.kind === 'wasm') {
      for (const file of item.upstream.paths) {
        const changed = nightlyCommit.files.find(entry => entry.filename === file)
        assert(changed, `nightly commit did not update ${file}`)
        assert.equal(changed.sha, item.gitBlob, file)
      }
    }
  }
  for (const item of build.evidence) verifyTreeEntry(sourceTree, item.path, item)
  for (const item of build.submodules) {
    const entry = sourceTree.tree.find(row => row.path === item.path)
    assert.equal(entry?.type, 'commit', item.path)
    assert.equal(entry.sha, item.commit, item.path)
  }
  for (const notice of provenance.notices) {
    const tree = notice.commit === build.sourceCommit ? sourceTree : pagesTree
    verifyTreeEntry(tree, notice.path, notice)
  }
}

test('JASSUB provenance checks all frozen local WASM/font bytes offline without making a remote claim', () => {
  assert.equal(provenance.schemaVersion, 1)
  assert.equal(provenance.kind, 'append-only-provenance-supplement')
  assert.equal(provenance.assets.length, 13)
  const baseline = readJson(provenance.baseline)
  const expected = baseline.assets.filter(item => /\.(?:wasm|ttf|otf|woff2)$/i.test(item.file))
  const files = provenance.assets.flatMap(item => [item.file, ...item.aliases])
  assert.equal(new Set(files).size, files.length)
  assert.deepEqual(files.toSorted(), expected.map(item => item.file).toSorted())
  for (const item of provenance.assets) {
    const original = fs.readFileSync(item.file)
    for (const file of [item.file, ...item.aliases]) {
      const frozen = expected.find(entry => entry.file === file)
      assert.equal(item.sha256, frozen.sha256, `supplement must retain frozen ${file}`)
      assert.equal(item.bytes, frozen.bytes, file)
      const bytes = fs.readFileSync(file)
      verifyBytes(bytes, item, file)
      assert.deepEqual(bytes, original, file)
    }
  }
  const vendor = readJson(provenance.vendorComparison)
  for (const notice of provenance.notices) {
    assert.equal(notice.npm.version, vendor.version)
    assert.equal(notice.npm.sha256, vendor.files[notice.npm.member])
  }
})

test('JASSUB provenance retains explicit build and licensing limits', () => {
  const { licensing, upstream, validation } = provenance
  assert.equal(upstream.build.reproduced, false)
  assert.equal(licensing.redistributionApproval, false)
  assert.equal(licensing.completeNoticeAudit, false)
  assert.equal(validation.browserValidated, false)
  const fonts = provenance.assets.filter(item => item.kind === 'font').map(item => path.basename(item.file))
  const classified = [...licensing.openFontNoticeAssembly, ...licensing.unresolvedFontPermission]
  assert.equal(new Set(classified).size, fonts.length)
  assert.deepEqual(classified.toSorted(), fonts.toSorted())
})

if (cachedEvidence) {
  test('JASSUB explicitly rechecks saved downloaded bytes and lineage without refreshing network evidence', () => {
    const { pagesSnapshot, wasmNightly, build } = provenance.upstream
    verifyLineage(
      readJson(path.join(cache, pagesSnapshot.cachedCommit)),
      readJson(path.join(cache, wasmNightly.cachedCommit)),
      readJson(path.join(cache, pagesSnapshot.cachedTree)),
      readJson(path.join(cache, build.cachedTree)),
    )
    for (const item of [...provenance.assets, ...build.evidence, ...provenance.notices]) {
      const bytes = fs.readFileSync(path.join(cache, item.cachedDownload))
      verifyBytes(bytes, item, item.cachedDownload)
      if (item.file)
        assert.deepEqual(bytes, fs.readFileSync(item.file), item.file)
      if (item.npm) {
        const npm = fs.readFileSync(path.join(cache, item.npm.cachedDownload))
        assert.equal(npm.length, item.npm.bytes)
        assert.equal(digest(npm), item.npm.sha256)
        assert.notDeepEqual(bytes, npm)
        assert.equal(bytes.toString().replaceAll('\r\n', '\n'), npm.toString().replaceAll('\r\n', '\n'))
      }
    }
  })
}

if (network) {
  test('JASSUB explicitly fetches immutable upstream commits, trees and bytes; unavailable evidence fails', async (context) => {
    const { api, pagesSnapshot, wasmNightly, build } = provenance.upstream
    assert.equal(api, 'https://api.github.com/repos/ThaUnknown/jassub')
    let requests = 0
    async function getJson(suffix) {
      const response = await fetch(`${api}/${suffix}`, { signal: AbortSignal.timeout(20000) })
      requests++
      assert(response.ok, `upstream HTTP ${response.status}: ${suffix}`)
      return response.json()
    }
    const [pagesCommit, nightlyCommit, pagesTree, sourceTree, nightlyTree] = await Promise.all([
      getJson(`commits/${pagesSnapshot.commit}`),
      getJson(`commits/${wasmNightly.commit}`),
      getJson(`git/trees/${pagesSnapshot.commit}?recursive=1`),
      getJson(`git/trees/${build.sourceCommit}?recursive=1`),
      getJson(`git/trees/${wasmNightly.commit}?recursive=1`),
    ])
    verifyLineage(pagesCommit, nightlyCommit, pagesTree, sourceTree)
    for (const item of provenance.assets.filter(item => item.kind === 'wasm')) {
      for (const file of item.upstream.paths) verifyTreeEntry(nightlyTree, file, item)
    }
    for (const notice of provenance.notices.filter(item => item.commit === wasmNightly.commit))
      verifyTreeEntry(nightlyTree, notice.path, notice)
    for (const item of [...provenance.assets, ...build.evidence, ...provenance.notices]) {
      const remote = await getJson(`git/blobs/${item.gitBlob}`)
      assert.equal(remote.encoding, 'base64')
      assert.equal(remote.sha, item.gitBlob)
      const bytes = Buffer.from(remote.content, 'base64')
      verifyBytes(bytes, item, item.file ?? item.path)
      if (item.file)
        assert.deepEqual(bytes, fs.readFileSync(item.file), item.file)
    }
    context.diagnostic(`Fresh network verification finished at ${new Date().toISOString()}: ${requests} successful requests; no cache fallback; 13 downloaded asset comparisons.`)
  })
}
