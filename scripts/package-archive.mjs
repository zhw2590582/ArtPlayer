import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

export function packedFiles(archive) {
  const args = { encoding: 'utf8', windowsHide: true }
  const names = execFileSync('tar', ['-tzf', archive], args).trim().split(/\r?\n/)
  const entries = execFileSync('tar', ['-tvzf', archive], args).trim().split(/\r?\n/)
  assert.equal(names.length, entries.length, 'Archive listing mismatch')
  assert.equal(new Set(names).size, names.length, 'Duplicate archive members')
  return names.filter((name, index) => {
    const type = entries[index][0]
    assert(['d', '-'].includes(type), 'Package links and special files are unsupported')
    assert((type === 'd' && name === 'package') || name.startsWith('package/'), 'Invalid package root')
    assert(!name.includes('\\') && !name.split('/').includes('..'), 'Unsafe package member')
    return type === '-'
  }).sort()
}
