import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise the real local generation and draft filesystem contracts.
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { runTranslation } from '../scripts/documentation/cli.ts'
import { buildCorpus } from '../scripts/documentation/corpus.ts'
import {
  atomicWrite,
  ownedPath,
  read,
  sha256,
} from '../scripts/documentation/files.ts'
import {
  protectMarkdown,
  splitTranslation,
} from '../scripts/documentation/markdown.ts'
import { translateChunk } from '../scripts/documentation/remote.ts'
import {
  applyTranslationDraft,
  createTranslationDraft,
  translationPlan,
  validateTranslationDraft,
} from '../scripts/documentation/translation.ts'

const root = process.cwd()
const cache = path.resolve('refactor/.cache')
const docs = 'packages/artplayer-vitepress/docs'
const source
  = '# 说明\n\nKeep `api` and [link](./path).\n\n```md\n## inside code\n::: not an admonition\n```\n\n说明正文\n'
function fixture() {
  const directory = fs.mkdtempSync(path.join(cache, 'ai-docs-test-'))
  for (const [file, text] of [
    [`${docs}/index.md`, source],
    [`${docs}/start/option.md`, source],
    [`${docs}/en/index.md`, 'Original index\r\n'],
    [`${docs}/en/start/option.md`, 'Original option\r\n'],
    [`${docs}/en/manual.md`, 'Preserve manually maintained extra page'],
  ])
    atomicWrite(ownedPath(directory, file), text)
  return directory
}
function remove(directory) {
  const relative = path.relative(cache, fs.realpathSync(directory))
  assert(relative.startsWith('ai-docs-test-') && !relative.includes(path.sep))
  fs.rmSync(directory, { recursive: true, force: true })
}
function snapshot(directory) {
  return ['index.md', 'start/option.md', 'manual.md'].map(file =>
    fs.readFileSync(ownedPath(directory, `${docs}/en/${file}`), 'utf8'),
  )
}
const translator = async chunk => chunk.replaceAll('说明', 'Description')

test('old translator deletes English before failure and corrupts legitimate Markdown code; old final 429 returns undefined', async () => {
  const old = execFileSync(
    'git',
    ['show', '647f3e7f12b1026f7d0de0830080d2d17b23d14d:scripts/trans-docs.js'],
    { encoding: 'utf8' },
  )
  const parsed = ts.createSourceFile(
    'old.js',
    old,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  )
  const functionCode = name =>
    parsed.statements
      .find(node => ts.isFunctionDeclaration(node) && node.name.text === name)
      .getText(parsed)
  const directory = fixture()
  try {
    const outputRoot = ownedPath(directory, `${docs}/en`)
    const context = vm.createContext({
      fs: {
        ...fs,
        rmSync(target, options) {
          assert.equal(path.resolve(target), outputRoot)
          fs.rmSync(target, options)
        },
      },
      path,
      rootDir: ownedPath(directory, 'packages/artplayer-vitepress'),
      outputRoot,
      indexFile: 'docs/index.md',
      processFile: async () => {
        throw new Error('API failure')
      },
      console: { log() {} },
    })
    await assert.rejects(
      vm.runInContext(`${functionCode('main')} main()`, context),
      /API failure/,
    )
    assert(!fs.existsSync(path.join(outputRoot, 'manual.md')))
    const damaged = vm.runInNewContext(
      `${functionCode('fixMarkdownCodeBlocks')} fixMarkdownCodeBlocks(input)`,
      { input: source },
    )
    assert.notEqual(damaged.content, source)
    assert(damaged.fixes > 0)
    const rateLimited = vm.runInNewContext(
      `${functionCode('callDeepSeekAPI')} callDeepSeekAPI('text','fixture',1)`,
      {
        MAX_RETRIES: 3,
        REQUEST_TIMEOUT: 60000,
        API_URL: 'fixture',
        API_KEY: 'fixture',
        AbortController,
        fetch: async () => ({ status: 429 }),
        setTimeout: (callback, ms) => {
          if (ms !== 60000)
            queueMicrotask(callback)
          return 1
        },
        clearTimeout() {},
        console: { log() {}, error() {} },
      },
    )
    assert.equal(await rateLimited, undefined)
  }
  finally {
    remove(directory)
  }
})

test('Markdown protection preserves code and rejects lost markers or inline code/link changes; chunks stay bounded', () => {
  const protectedSource = protectMarkdown(source)
  assert(!protectedSource.masked.includes('inside code'))
  assert.equal(protectedSource.restore(protectedSource.masked), source)
  assert.throws(
    () => protectedSource.restore('lost all blocks'),
    /lost or duplicated/,
  )
  assert.throws(
    () =>
      protectedSource.restore(
        protectedSource.masked.replace('`api`', '`wrong`'),
      ),
    /changed code/,
  )
  assert.throws(
    () =>
      protectedSource.restore(
        protectedSource.masked.replace('./path', './wrong'),
      ),
    /changed code/,
  )
  assert.throws(() => protectMarkdown('```js\nunterminated'), /Unclosed/)
  const chunks = splitTranslation(
    `${'😀'.repeat(500)}\n${protectedSource.masked}`,
    128,
  )
  assert(
    chunks.every(
      chunk =>
        chunk.length > 0
        && chunk.length <= 128
        && !/[\uD800-\uDBFF]$/.test(chunk),
    ),
  )
  assert(chunks.some(chunk => chunk.includes('ARTPLAYER_KEEP_')))
})

test('failed or damaged translation only leaves a failed draft and never changes existing English', async () => {
  for (const translate of [
    async () => {
      throw new Error('request failed')
    },
    async () => 'lost placeholders',
  ]) {
    const directory = fixture()
    try {
      const before = snapshot(directory)
      await assert.rejects(
        createTranslationDraft(directory, translate, 2),
        /draft failed/,
      )
      assert.deepEqual(snapshot(directory), before)
      const drafts = fs.readdirSync(
        ownedPath(directory, 'refactor/.cache/translations'),
      )
      const manifest = JSON.parse(
        read(
          ownedPath(
            directory,
            `refactor/.cache/translations/${drafts[0]}/manifest.json`,
          ),
        ),
      )
      assert.equal(manifest.status, 'failed')
    }
    finally {
      remove(directory)
    }
  }
})

test('all 13 existing translation sources retain protected structure through chunking', () => {
  const entries = translationPlan(root)
  assert.equal(entries.length, 13)
  for (const entry of entries) {
    const text = read(ownedPath(root, entry.source))
    const protectedSource = protectMarkdown(text)
    assert.equal(
      protectedSource.restore(protectedSource.masked),
      text,
      entry.relative,
    )
    protectedSource.restore(
      splitTranslation(protectedSource.masked).join('\n\n'),
    )
  }
})

test('a failing translation cancels and awaits its active sibling before returning', async () => {
  const directory = fixture()
  let calls = 0
  let siblingStopped = false
  try {
    const before = snapshot(directory)
    await assert.rejects(
      createTranslationDraft(
        directory,
        async (_chunk, signal) => {
          if (++calls === 1) {
            await new Promise(resolve => setImmediate(resolve))
            throw new Error('First request failed')
          }
          await new Promise(resolve =>
            signal.addEventListener('abort', resolve, { once: true }),
          )
          await new Promise(resolve => setImmediate(resolve))
          siblingStopped = true
          signal.throwIfAborted()
          return ''
        },
        2,
      ),
      /First request failed/,
    )
    assert.equal(calls, 2)
    assert.equal(siblingStopped, true)
    assert.deepEqual(snapshot(directory), before)
  }
  finally {
    remove(directory)
  }
})

test('rollback refuses to overwrite a concurrent English edit', async () => {
  const directory = fixture()
  try {
    const draft = await createTranslationDraft(directory, translator)
    let written
    assert.throws(
      () =>
        applyTranslationDraft(directory, draft, (file, content) => {
          if (written) {
            atomicWrite(written, 'Concurrent author edit')
            throw new Error('Second write failed')
          }
          atomicWrite(file, content)
          written = file
        }),
      error =>
        error instanceof AggregateError
        && error.errors.some(item => /Concurrent change/.test(item.message)),
    )
    assert.equal(read(written), 'Concurrent author edit')
    assert.equal(snapshot(directory)[1], 'Original option\r\n')
  }
  finally {
    remove(directory)
  }
})

test('draft validation permits reviewed prose edits and apply preserves unselected pages', async () => {
  const directory = fixture()
  try {
    const before = snapshot(directory)
    const draft = await createTranslationDraft(directory, translator)
    assert.deepEqual(snapshot(directory), before)
    const file = ownedPath(draft, 'index.md')
    atomicWrite(
      file,
      read(file).replace('Description', 'Reviewed description'),
    )
    assert.throws(
      () => applyTranslationDraft(directory, draft),
      /without validation/,
    )
    validateTranslationDraft(directory, draft)
    applyTranslationDraft(directory, draft)
    const after = snapshot(directory)
    assert(after[0].includes('Reviewed description'))
    assert(after[1].includes('Description'))
    assert.equal(after[2], before[2])
    assert.throws(
      () => applyTranslationDraft(directory, draft),
      /not complete/,
    )
  }
  finally {
    remove(directory)
  }
})

test('stale sources, changed targets, path tampering and mid-apply failures are rejected without wiping English', async () => {
  for (const mode of ['source', 'target', 'mapping', 'write-failure']) {
    const directory = fixture()
    try {
      const draft = await createTranslationDraft(directory, translator)
      if (mode === 'source') {
        atomicWrite(
          ownedPath(directory, `${docs}/index.md`),
          '# Edited source',
        )
      }
      if (mode === 'target') {
        atomicWrite(
          ownedPath(directory, `${docs}/en/index.md`),
          'Manual English edit',
        )
      }
      if (mode === 'mapping') {
        const file = ownedPath(draft, 'manifest.json')
        const manifest = JSON.parse(read(file))
        manifest.entries[0].target = '../escape.md'
        atomicWrite(file, JSON.stringify(manifest))
      }
      const before = snapshot(directory)
      let writes = 0
      assert.throws(() =>
        applyTranslationDraft(directory, draft, (file, content) => {
          if (mode === 'write-failure' && ++writes === 2)
            throw new Error('Injected rename failure')
          atomicWrite(file, content)
        }),
      )
      assert.deepEqual(snapshot(directory), before)
    }
    finally {
      remove(directory)
    }
  }
})

test('owned paths reject traversal and a junction outside the fixture root', () => {
  const directory = fixture()
  const external = fixture()
  const link = path.join(directory, 'linked')
  try {
    assert.throws(() => ownedPath(directory, '../escape.md'), /Invalid/)
    fs.symlinkSync(
      external,
      link,
      process.platform === 'win32' ? 'junction' : 'dir',
    )
    assert.throws(() => ownedPath(directory, 'linked/new.md'), /escapes/)
    fs.unlinkSync(link)
    fs.symlinkSync(path.join(external, 'missing'), link, process.platform === 'win32' ? 'junction' : 'dir')
    assert.throws(() => ownedPath(directory, 'linked/new.md'))
  }
  finally {
    if (fs.lstatSync(link, { throwIfNoEntry: false }))
      fs.unlinkSync(link)
    remove(directory)
    remove(external)
  }
})

test('remote request rejects final rate limits, invalid/empty responses and auth without unbounded retries', async () => {
  for (const [status, body, callsExpected] of [
    [429, {}, 3],
    [401, {}, 1],
    [200, {}, 1],
    [200, { choices: [{ message: { content: '' } }] }, 1],
  ]) {
    let calls = 0
    await assert.rejects(
      translateChunk('fixture', {
        key: 'fixture-key',
        wait: async () => {},
        request: async (_url, options) => {
          calls++
          assert.equal(options.headers.Authorization, 'Bearer fixture-key')
          return Response.json(body, { status })
        },
      }),
    )
    assert.equal(calls, callsExpected)
  }
  let calls = 0
  const text = await translateChunk('fixture', {
    key: 'fixture-key',
    wait: async () => {},
    request: async () =>
      ++calls === 1
        ? new Response('', { status: 503 })
        : Response.json({ choices: [{ message: { content: 'Translated' } }] }),
  })
  assert.equal(text, 'Translated')
  assert.equal(calls, 2)
  let invalidCalls = 0
  await assert.rejects(translateChunk('fixture', {
    key: 'fixture-key',
    request: async () => {
      invalidCalls++
      return new Response('Invalid provider response body')
    },
  }), /Invalid translation JSON response/)
  assert.equal(invalidCalls, 1)
})

test('timeout covers reading a real HTTP response body, not only receiving its headers', async () => {
  const server = http.createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.write('{"choices":[')
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const address = server.address()
    await assert.rejects(
      translateChunk('fixture', {
        key: 'fixture-key',
        timeoutMs: 80,
        retries: 1,
        request: (_url, options) =>
          fetch(`http://127.0.0.1:${address.port}`, options),
      }),
      /abort|timed out/i,
    )
  }
  finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
  }
})

test('offline corpus is exact and deterministic; default translation and unknown flags never call the network', async () => {
  const outputs = buildCorpus(root)
  assert.deepEqual(outputs, buildCorpus(root))
  for (const [file, content] of outputs)
    assert.equal(read(ownedPath(root, file)), content)
  const manifest = JSON.parse(outputs.get('docs/llms.manifest.json'))
  for (const entry of manifest.sources) {
    const text = read(ownedPath(root, entry.file))
    assert.equal(sha256(text), entry.sha256Lf)
    assert(outputs.get('docs/llms.txt').includes(text))
  }
  const original = globalThis.fetch
  globalThis.fetch = async () => {
    throw new Error('Unexpected network')
  }
  const directory = fixture()
  try {
    const before = snapshot(directory)
    /* eslint-disable no-console -- Silence the CLI plan while checking its no-network behavior. */
    const originalLog = console.log
    try {
      console.log = () => {}
      await runTranslation([], directory)
    }
    finally {
      console.log = originalLog
    }
    /* eslint-enable no-console */
    await assert.rejects(runTranslation(['--unknown'], directory), /Use yarn/)
    assert.deepEqual(snapshot(directory), before)
    assert.equal(translationPlan(directory).length, 2)
    const result = spawnSync(
      process.execPath,
      ['scripts/build-llm.js', '--check'],
      {
        cwd: root,
        env: { ...process.env, DEEPSEEK_API_KEY: '' },
        encoding: 'utf8',
      },
    )
    assert.equal(result.status, 0, result.stderr)
  }
  finally {
    globalThis.fetch = original
    remove(directory)
  }
})
