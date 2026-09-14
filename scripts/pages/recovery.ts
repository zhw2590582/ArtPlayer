import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { inside, inventory } from './artifact.ts'

export interface GitFile { objectId: string, bytes: number }

export function verifyRestoredTree(root: string, expected: Record<string, GitFile>) {
  const files = inventory(root)
  assert.deepEqual(Object.keys(files).sort(), Object.keys(expected).sort(), 'Restored site has missing or additional files')
  for (const [relative, identity] of Object.entries(expected)) {
    const bytes = fs.readFileSync(inside(root, relative))
    assert.equal(bytes.length, identity.bytes, `Restored file size differs: ${relative}`)
    const objectId = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
    assert.equal(objectId, identity.objectId, `Restored Git blob differs: ${relative}`)
  }
  return files
}

export function replaceRehearsalSite(run: string, expected: Record<string, GitFile>) {
  const root = fs.realpathSync(run)
  const live = inside(root, 'site')
  const prepared = inside(root, 'prepared')
  const failed = inside(root, 'failed-site')
  assert(!fs.existsSync(failed), 'Previous failed snapshot must not be overwritten')
  for (const directory of [live, prepared]) {
    assert.equal(fs.realpathSync(directory), directory, 'Rehearsal directories must not be links')
    assert(fs.lstatSync(directory).isDirectory())
  }
  verifyRestoredTree(prepared, expected)
  fs.renameSync(live, failed)
  try {
    fs.renameSync(prepared, live)
  }
  catch (error) {
    fs.renameSync(failed, live)
    throw error
  }
  return verifyRestoredTree(live, expected)
}
