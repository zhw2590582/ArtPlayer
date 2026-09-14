import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { globSync } from 'glob'
import { atomicWrite, ownedPath, read, sha256 } from './files.ts'
import {
  markdownSignature,
  protectMarkdown,
  splitTranslation,
} from './markdown.ts'

interface TranslationEntry {
  source: string
  target: string
  relative: string
  sourceHash: string
  targetHash: string | null
  translatedHash?: string
}
interface Draft {
  schemaVersion: 1
  status: 'incomplete' | 'failed' | 'complete' | 'applied'
  entries: TranslationEntry[]
  error?: string
}
const docs = 'packages/artplayer-vitepress/docs'
const drafts = 'refactor/.cache/translations'

export function translationPlan(root: string): TranslationEntry[] {
  return [
    'index.md',
    ...globSync('{advanced,component,start}/**/*.md', {
      cwd: ownedPath(root, docs),
      posix: true,
    }).sort(),
  ].map((relative) => {
    const source = `${docs}/${relative}`
    const target = `${docs}/en/${relative}`
    const destination = ownedPath(root, target)
    return {
      source,
      target,
      relative,
      sourceHash: sha256(read(ownedPath(root, source))),
      targetHash: fs.existsSync(destination) ? sha256(read(destination)) : null,
    }
  })
}

export async function createTranslationDraft(
  root: string,
  translate: (content: string, signal: AbortSignal) => Promise<string>,
  concurrency = 3,
): Promise<string> {
  assert(Number.isInteger(concurrency) && concurrency > 0 && concurrency <= 5)
  const entries = translationPlan(root)
  const cache = ownedPath(root, drafts)
  fs.mkdirSync(cache, { recursive: true })
  const directory = fs.mkdtempSync(path.join(cache, 'draft-'))
  const manifest: Draft = { schemaVersion: 1, status: 'incomplete', entries }
  const save = () =>
    atomicWrite(
      path.join(directory, 'manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
    )
  save()
  const controller = new AbortController()
  let cursor = 0
  let failure: unknown
  async function worker(): Promise<void> {
    try {
      while (!controller.signal.aborted) {
        const entry = entries[cursor++]
        if (!entry)
          return
        const source = read(ownedPath(root, entry.source))
        assert.equal(
          sha256(source),
          entry.sourceHash,
          'Source changed before translation',
        )
        const protectedSource = protectMarkdown(source)
        const chunks: string[] = []
        for (const chunk of splitTranslation(protectedSource.masked)) {
          controller.signal.throwIfAborted()
          chunks.push(await translate(chunk, controller.signal))
        }
        controller.signal.throwIfAborted()
        const translated = protectedSource.restore(chunks.join('\n\n'))
        assert(translated.trim(), 'Empty translated document')
        atomicWrite(ownedPath(directory, entry.relative), translated)
        entry.translatedHash = sha256(translated)
        save()
      }
    }
    catch (error) {
      if (!controller.signal.aborted)
        failure = error
      controller.abort(error)
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, entries.length) }, worker),
  )
  if (controller.signal.aborted) {
    manifest.status = 'failed'
    manifest.error
      = failure instanceof Error ? failure.message : 'Translation failed'
    save()
    throw new Error(
      `Translation draft failed; existing English files unchanged. Draft: ${directory}. ${manifest.error}`,
    )
  }
  manifest.status = 'complete'
  save()
  return directory
}

function inspectDraft(root: string, directory: string, checkHash = true) {
  const relative = path
    .relative(fs.realpathSync(root), path.resolve(directory))
    .split(path.sep)
    .join('/')
  assert(
    relative.startsWith(`${drafts}/draft-`),
    'Apply requires an owned translation draft',
  )
  const safeDirectory = ownedPath(root, relative)
  const manifest = JSON.parse(
    read(ownedPath(safeDirectory, 'manifest.json')),
  ) as Draft
  assert(
    manifest.schemaVersion === 1
    && manifest.status === 'complete'
    && Array.isArray(manifest.entries),
    'Draft is not complete',
  )
  const current = translationPlan(root)
  assert.equal(
    manifest.entries.length,
    current.length,
    'Translation source set changed',
  )
  const changes = current.map((entry, index) => {
    const saved = manifest.entries[index]
    assert(
      saved
      && saved.source === entry.source
      && saved.target === entry.target
      && saved.relative === entry.relative,
      'Invalid draft file mapping',
    )
    assert.equal(
      saved.sourceHash,
      entry.sourceHash,
      'Source changed since translation',
    )
    assert.equal(
      saved.targetHash,
      entry.targetHash,
      'English document changed since translation',
    )
    const content = read(ownedPath(safeDirectory, entry.relative))
    if (checkHash) {
      assert.equal(
        sha256(content),
        saved.translatedHash,
        'Draft content changed without validation',
      )
    }
    assert.deepEqual(
      markdownSignature(content),
      markdownSignature(read(ownedPath(root, entry.source))),
      'Draft changed protected Markdown',
    )
    const file = ownedPath(root, entry.target)
    return {
      ...entry,
      file,
      content,
      before: fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null,
    }
  })
  return { safeDirectory, manifest, changes }
}

export function validateTranslationDraft(
  root: string,
  directory: string,
): void {
  const { safeDirectory, manifest, changes } = inspectDraft(
    root,
    directory,
    false,
  )
  changes.forEach((change, index) => {
    const entry = manifest.entries[index]
    assert(entry)
    entry.translatedHash = sha256(change.content)
  })
  atomicWrite(
    ownedPath(safeDirectory, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
}

export function applyTranslationDraft(
  root: string,
  directory: string,
  write: typeof atomicWrite = atomicWrite,
): void {
  const { safeDirectory, manifest, changes } = inspectDraft(root, directory)
  const applied: typeof changes = []
  try {
    for (const change of changes) {
      assert.equal(
        sha256(read(ownedPath(root, change.source))),
        change.sourceHash,
        'Source changed during apply',
      )
      assert.equal(
        read(ownedPath(safeDirectory, change.relative)),
        change.content,
        'Draft changed during apply',
      )
      assert.equal(ownedPath(root, change.target), change.file)
      const currentHash = fs.existsSync(change.file)
        ? sha256(read(change.file))
        : null
      assert.equal(
        currentHash,
        change.targetHash,
        'English document changed during apply',
      )
      write(change.file, change.content)
      applied.push(change)
    }
    for (const change of changes) {
      assert.equal(
        sha256(read(ownedPath(root, change.source))),
        change.sourceHash,
        'Source changed during apply',
      )
    }
    manifest.status = 'applied'
    atomicWrite(
      ownedPath(safeDirectory, 'manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
    )
  }
  catch (error) {
    const failures: unknown[] = [error]
    for (const change of applied.reverse()) {
      try {
        assert.equal(
          sha256(read(change.file)),
          sha256(change.content),
          'Concurrent change prevents safe rollback',
        )
        if (change.before === null)
          fs.unlinkSync(change.file)
        else atomicWrite(change.file, change.before)
      }
      catch (failure) {
        failures.push(failure)
      }
    }
    throw new AggregateError(
      failures,
      'Draft apply failed; inspect errors and retained draft before retrying',
    )
  }
}
