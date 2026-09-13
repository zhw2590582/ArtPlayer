import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { archiveFiles, hash, readMember, refactorDir } from './releases.mjs'

assert.deepEqual(process.argv.slice(2), ['--network'], 'Explicit --network required; this command does not execute downloaded code')
const root = path.resolve(refactorDir, '..')
const cache = fs.mkdtempSync(path.join(refactorDir, '.cache/site-provenance-'))
const report = { task: 'SITE-01', capturedAt: new Date().toISOString(), cache, packages: [], passed: false }
const json = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
try {
  for (const [name, version] of [['artplayer-plugin-thumbnail', '1.0.3'], ['vconsole', '3.15.0'], ['monaco-editor', '0.30.1']]) {
    const registry = `https://registry.npmjs.org/${name}/${version}`
    const metadataResponse = await fetch(registry, { redirect: 'error', signal: AbortSignal.timeout(30000) })
    assert(metadataResponse.ok, `${registry}: ${metadataResponse.status}`)
    const metadata = await metadataResponse.json()
    assert.equal(metadata.name, name)
    assert.equal(metadata.version, version)
    const url = new URL(metadata.dist.tarball)
    assert.equal(url.origin, 'https://registry.npmjs.org')
    const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(60000) })
    assert(response.ok, `${url}: ${response.status}`)
    const bytes = Buffer.from(await response.arrayBuffer())
    assert.equal(`sha512-${hash(bytes, 'sha512', 'base64')}`, metadata.dist.integrity)
    assert.equal(hash(bytes, 'sha1'), metadata.dist.shasum)
    const archive = path.join(cache, `${name}-${version}.tgz`)
    fs.writeFileSync(archive, bytes)
    const members = archiveFiles(archive)
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const row = { name, version, registry, tarball: url.href, integrity: metadata.dist.integrity, sha256: hash(bytes), repository: metadata.repository, manifest, files: members, matches: [], notices: [] }
    report.packages.push(row)
    for (const member of members.filter(member => /(?:license|thirdpartynotices|notice)(?:\.\w+)?$/i.test(member))) {
      const content = readMember(archive, member)
      const target = `${name}-${path.basename(member)}.txt`
      fs.writeFileSync(path.join(cache, target), content)
      row.notices.push({ member, cached: target, sha256: hash(content) })
    }
    if (name === 'artplayer-plugin-thumbnail') {
      for (const member of members.filter(member => /(?:README\.md|src\/index\.js|types\/.*\.d\.ts)$/i.test(member))) fs.writeFileSync(path.join(cache, `${name}-${member.replaceAll('/', '_')}.txt`), readMember(archive, member))
    }
    else {
      const mappings = name === 'vconsole'
        ? [['docs/assets/js/vconsole.min.js', 'package/dist/vconsole.min.js']]
        : fs.readdirSync(path.join(root, 'docs/assets/js/vs'), { recursive: true, withFileTypes: true }).filter(entry => entry.isFile()).map((entry) => {
            const relative = path.relative(path.join(root, 'docs/assets/js/vs'), path.join(entry.parentPath, entry.name)).replaceAll('\\', '/')
            return [`docs/assets/js/vs/${relative}`, `package/min/vs/${relative}`]
          }).sort(([a], [b]) => a.localeCompare(b))
      for (const [file, member] of mappings) {
        const local = fs.readFileSync(path.join(root, file))
        const upstream = members.includes(member) ? readMember(archive, member) : null
        row.matches.push({ file, member, sha256: hash(local), upstreamSha256: upstream && hash(upstream), equal: upstream !== null && local.equals(upstream), equalLf: upstream !== null && local.toString('utf8').replaceAll('\r\n', '\n') === upstream.toString('utf8').replaceAll('\r\n', '\n') })
      }
    }
    console.log(`${name}@${version}: ${row.matches.filter(item => item.equal).length}/${row.matches.length} exact local matches, ${row.notices.length} upstream notice files`)
  }
  report.passed = true
}
finally {
  json(path.join(cache, 'report.json'), report)
  console.log(`Provenance evidence: ${cache}`)
}
