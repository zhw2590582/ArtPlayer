import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { ownedPath, sha256 } from '../documentation/files.ts'

const targets = {
  i18n: ['packages/artplayer/dist/i18n', 'docs/compiled/i18n'],
  docs: ['docs/document'],
} as const

export function treeFingerprint(directory: string): string | null {
  if (!fs.existsSync(directory))
    return null
  const entries: string[] = []
  function visit(current: string, relative: string): void {
    assert(
      fs.lstatSync(current).isDirectory(),
      'Artifact root must be a directory',
    )
    for (const item of fs
      .readdirSync(current, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const name = `${relative}/${item.name}`
      assert(
        !item.isSymbolicLink(),
        'Artifact tree must not contain symbolic links',
      )
      if (item.isDirectory()) {
        entries.push(`directory:${name}`)
        visit(path.join(current, item.name), name)
      }
      else {
        assert(item.isFile(), 'Unexpected artifact entry')
        entries.push(
          `${name}:${sha256(fs.readFileSync(path.join(current, item.name)).toString('base64'))}`,
        )
      }
    }
  }
  visit(directory, '')
  return sha256(entries.join('\n'))
}

export async function stageArtifacts(
  root: string,
  kind: keyof typeof targets,
  produce: (stages: string[]) => Promise<void>,
  rename = fs.renameSync,
): Promise<void> {
  const cache = ownedPath(root, 'refactor/.cache/site-build')
  fs.mkdirSync(cache, { recursive: true })
  const lock = path.join(cache, `${kind}.lock`)
  const handle = fs.openSync(lock, 'wx')
  let run: string | undefined
  let retain = false
  try {
    run = fs.mkdtempSync(path.join(cache, `${kind}-`))
    const rows = targets[kind].map((relative, index) => {
      const destination = ownedPath(root, relative)
      const stage = path.join(run!, `output-${index}`)
      fs.mkdirSync(stage)
      return {
        relative,
        destination,
        stage,
        backup: path.join(run!, `backup-${index}`),
        before: treeFingerprint(destination),
        saved: false,
        installed: false,
        after: '',
      }
    })
    await produce(rows.map(row => row.stage))
    for (const row of rows) {
      assert(fs.readdirSync(row.stage).length, 'Build produced no artifacts')
      row.after = treeFingerprint(row.stage)!
      assert.equal(
        treeFingerprint(ownedPath(root, row.relative)),
        row.before,
        'Artifact output changed while building',
      )
    }
    try {
      for (const row of rows) {
        assert.equal(ownedPath(root, row.relative), row.destination)
        assert.equal(
          treeFingerprint(row.destination),
          row.before,
          'Artifact output changed during replacement',
        )
        fs.mkdirSync(path.dirname(row.destination), { recursive: true })
        if (row.before !== null) {
          rename(row.destination, row.backup)
          row.saved = true
        }
        rename(row.stage, row.destination)
        row.installed = true
      }
    }
    catch (error) {
      const errors = [error]
      for (const row of [...rows].reverse()) {
        try {
          if (row.installed) {
            assert.equal(
              treeFingerprint(row.destination),
              row.after,
              'Concurrent output edit prevents rollback',
            )
            fs.renameSync(row.destination, row.stage)
          }
          if (row.saved) {
            assert(
              !fs.existsSync(row.destination),
              'Rollback target is occupied',
            )
            fs.renameSync(row.backup, row.destination)
          }
        }
        catch (failure) {
          retain = true
          errors.push(failure)
        }
      }
      throw new AggregateError(
        errors,
        `Artifact replacement failed. ${retain ? `Inspect retained backups: ${run}` : 'Previous outputs restored.'}`,
      )
    }
  }
  finally {
    try {
      if (run && !retain) {
        assert.equal(path.dirname(run), cache)
        assert.equal(fs.realpathSync(run), run)
        fs.rmSync(run, { recursive: true, force: true })
      }
    }
    finally {
      fs.closeSync(handle)
      fs.unlinkSync(lock)
    }
  }
}
