import type { VendorManifest } from '../notices.ts'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

interface FontRecord {
  group: VendorManifest['groups'][number]
  unresolved: string[]
}

export function verifyFontNotices(root: string, manifest: VendorManifest) {
  const record = JSON.parse(fs.readFileSync(path.join(root, 'refactor/baselines/site-font-notices-provenance.json'), 'utf8')) as FontRecord
  assert.deepEqual(record.group.components?.map(component => component.name).sort(), ['Averia Sans Libre Light', 'CHAWP', 'Lato Regular', 'Liberation Sans'], 'Incomplete reviewed font roster')
  assert.equal(record.group.files.length, 5, 'Keep both default font copies and the three selected demo fonts')
  assert.equal(record.group.notices.length, 5, 'Keep four full font licenses and attribution')
  const group = manifest.groups.filter(group => group.name === 'jassub-fonts')
  assert.deepEqual(group, [record.group], 'Font notice/source binding changed')
  for (const file of record.group.files) {
    assert(!record.unresolved.includes(file.path), 'Unresolved font cannot be promoted by a notice binding')
    const bytes = fs.readFileSync(path.join(root, file.path))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, `Font bytes changed: ${file.path}`)
  }
  for (const notice of record.group.notices) {
    const bytes = fs.readFileSync(path.join(root, notice.source))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), notice.sha256, `Font notice changed: ${notice.source}`)
  }
}
