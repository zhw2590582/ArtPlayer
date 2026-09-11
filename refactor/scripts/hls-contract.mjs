import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { transform } from 'esbuild'
import ts from 'typescript'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
export const normalizeLF = value => value.toString().replace(/\r\n/g, '\n')

export async function functionHash(code) {
  const source = ts.createSourceFile('hls.js', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  assert.equal(source.parseDiagnostics.length, 0, 'Invalid HLS source')
  const names = ['uniqBy', 'artplayerPluginHlsControl']
  const functions = names.map((name) => {
    const matches = source.statements.filter(item => ts.isFunctionDeclaration(item) && item.name?.text === name)
    assert.equal(matches.length, 1, `Expected one function: ${name}`)
    return matches[0].getText(source).replace(/^export\s+default\s+/, '')
  })
  const normalized = await transform(functions.join('\n'), {
    loader: 'js',
    target: 'es2020',
    minifySyntax: true,
    minifyWhitespace: true,
  })
  return hash(normalized.code)
}

export async function verifyHlsContract() {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/hls-control-release.json'), 'utf8'))
  const { release } = baseline
  const archive = await ensureArchive(release)
  assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
  for (const [member, expected] of Object.entries(release.files)) {
    assert.equal(hash(readMember(archive, member)), expected, `Changed release member: ${member}`)
  }
  const manifest = JSON.parse(readMember(archive, 'package/package.json'))
  assert.deepEqual(manifest, release.manifest)
  for (const entry of [manifest.main, manifest.module, manifest.types, manifest.legacy]) {
    assert(Object.hasOwn(release.files, `package/${entry.replace(/^\.\//, '')}`))
  }
  assert(/^[a-f\d]{40}$/.test(baseline.sourceCommit))
  const historical = new Map()
  for (const [file, expected] of Object.entries(baseline.source)) {
    const content = normalizeLF(execFileSync('git', ['show', `${baseline.sourceCommit}:${file}`], { cwd: root }))
    assert.equal(hash(content), expected, `Changed historical source: ${file}`)
    historical.set(file, content)
  }
  for (const comparison of baseline.comparisons) {
    const published = hash(normalizeLF(readMember(archive, `package/${comparison.file}`)))
    const source = hash(historical.get(`packages/${release.name}/${comparison.file}`))
    assert.equal(published, comparison.publishedLF)
    assert.equal(source, comparison.workspaceLF)
    assert.equal(published === source, comparison.equal)
  }
  const sourceHash = await functionHash(historical.get(`packages/${release.name}/src/index.js`))
  const publishedHash = await functionHash(readMember(archive, `package/${manifest.module.replace(/^\.\//, '')}`).toString())
  assert.equal(sourceHash, baseline.functionComparison.sha256)
  assert.equal(publishedHash, sourceHash)
  console.log(`Verified ${release.name}@${release.version}: archive, ${Object.keys(release.files).length} members, historical sources, metadata and two normalized functions`)
  return { baseline, archive }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verifyHlsContract()
}
