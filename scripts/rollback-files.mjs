import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { hash } from '../refactor/scripts/releases.mjs'

export function verifyRollbackFiles(directory, pkg) {
  const root = path.join(directory, 'node_modules', pkg.name)
  assert.equal(fs.realpathSync(root), path.resolve(root), 'Rollback package must not be a workspace link')
  const actual = []
  function visit(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name)
      const relative = path.relative(root, file).replaceAll('\\', '/')
      assert(!entry.isSymbolicLink(), `Unexpected installed link: ${relative}`)
      if (entry.isDirectory()) {
        visit(file)
      }
      else {
        assert(entry.isFile(), `Unexpected installed special file: ${relative}`)
        // Yarn Classic may add these files at the package root.
        if (!['.yarn-metadata.json', '.yarn-tarball.tgz'].includes(relative))
          actual.push(`package/${relative}`)
      }
    }
  }
  visit(root)
  assert.deepEqual(actual.sort(), Object.keys(pkg.files).sort(), `Rollback contains missing or leftover files: ${pkg.name}`)
  for (const [member, digest] of Object.entries(pkg.files)) {
    assert(member.startsWith('package/') && !member.includes('\\') && !member.split('/').includes('..'), 'Unsafe rollback member')
    assert.equal(hash(fs.readFileSync(path.join(root, member.slice(8)))), digest, `Rollback bytes differ: ${pkg.name}/${member}`)
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  assert.equal(manifest.name, pkg.name)
  assert.equal(manifest.version, pkg.version)
  return { name: pkg.name, version: pkg.version, archiveSha256: pkg.sha256, verifiedMembers: actual.length }
}
