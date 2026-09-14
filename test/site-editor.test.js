import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
// eslint-disable-next-line test/no-import-node-test -- Verify editor failure and race contracts with controlled asynchronous boundaries.
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { readEditorFile } from '../packages/artplayer-vitepress/browser/editor-files.ts'
import {
  readPreference,
  writePreference,
} from '../packages/artplayer-vitepress/browser/editor-preferences.ts'
import { createEditorSession } from '../packages/artplayer-vitepress/browser/editor-session.ts'

const tick = () => new Promise(resolve => setImmediate(resolve))
function deferred() {
  let resolve
  const promise = new Promise((done) => {
    resolve = done
  })
  return { promise, resolve }
}

test('old editor executes TS syntax directly and has no file error settlement', async () => {
  const old = execFileSync(
    'git',
    [
      'show',
      'a468cb2c39e626f7b4f737d0ca60334150deae2b:docs/assets/js/common.js',
    ],
    { encoding: 'utf8' },
  )
  const ast = ts.createSourceFile('old.js', old, ts.ScriptTarget.Latest, true)
  function find(name) {
    let code
    function visit(node) {
      if (ts.isFunctionDeclaration(node) && node.name.text === name)
        code = node.getText(ast)
      ts.forEachChild(node, visit)
    }
    visit(ast)
    return code
  }
  assert.throws(
    () =>
      vm.runInNewContext(`${find('runCode')};runCode()`, {
        Event,
        window: { dispatchEvent() {} },
        Artplayer: { instances: [] },
        editor: { getValue: () => 'const count: number = 7;' },
      }),
    /Missing initializer|Unexpected token/,
  )
  let reader
  class Reader {
    constructor() {
      reader = this
    }

    readAsText() {}
  }
  const pending = vm.runInNewContext(
    `${find('readFile')};readFile({name:'broken.js'})`,
    { FileReader: Reader },
  )
  let settled = false
  pending.then(
    () => {
      settled = true
    },
    () => {
      settled = true
    },
  )
  assert.equal(reader.onerror, undefined)
  await tick()
  assert.equal(settled, false)
  const html = execFileSync('git', ['show', 'a468cb2c39e626f7b4f737d0ca60334150deae2b:docs/index.html'], { encoding: 'utf8' })
  const boot = html.match(/<script>(\s*var artplayer[\s\S]*?)<\/script>/)[1]
  assert.throws(() => vm.runInNewContext(boot, {
    document: { createElement: () => ({}) },
    localStorage: { getItem() { throw new Error('Storage denied') } },
  }), /Storage denied/)
})

test('latest editor run wins across delayed example and compiler responses; disposal forbids execution', async () => {
  const example = deferred()
  const compile = deferred()
  const executions = []
  const writes = []
  const session = createEditorSession({
    loadLibraries: async () => {},
    exampleSource: () => example.promise,
    writeCode: value => writes.push(value),
    compile: value =>
      value === 'old compile' ? compile.promise : Promise.resolve(value),
    execute: code => executions.push(code),
  })
  const initial = session.run({
    example: 'slow',
    code: encodeURIComponent('wrong priority'),
  })
  await tick()
  await session.run({ code: encodeURIComponent('new') })
  example.resolve('late example')
  await initial
  assert.deepEqual(writes, ['new'])
  const older = session.run({ code: encodeURIComponent('old compile') })
  await tick()
  await session.run({ code: encodeURIComponent('newest') })
  compile.resolve('late compiled')
  await older
  assert.deepEqual(executions, ['new', 'newest'])
  session.dispose()
  await session.run({ code: 'never' })
  assert.deepEqual(executions, ['new', 'newest'])
})

test('library and compiler failures reject without executing a partial or invalid run', async () => {
  for (const where of ['library', 'compile']) {
    const session = createEditorSession({
      loadLibraries: async () => {
        if (where === 'library')
          throw new Error('library failed')
      },
      exampleSource: async () => '',
      writeCode() {},
      compile: async () => {
        throw new Error('compile failed')
      },
      execute() {
        assert.fail('Must not execute')
      },
    })
    await assert.rejects(session.run({ code: 'source' }), /failed/)
  }
})

test('file reading settles errors, synchronous failures and cancellation and removes handlers', async () => {
  for (const mode of ['error', 'throw', 'abort', 'loaded']) {
    const controller = new AbortController()
    const reader = {
      result: 'source',
      error: new Error('unreadable'),
      readAsText() {
        if (mode === 'throw')
          throw new Error('read threw')
        if (mode === 'error')
          queueMicrotask(() => reader.onerror())
        if (mode === 'loaded')
          queueMicrotask(() => reader.onload())
      },
      abort() {
        reader.onabort?.()
      },
    }
    const promise = readEditorFile(
      { name: 'input.js' },
      controller.signal,
      () => reader,
    )
    if (mode === 'abort')
      controller.abort()
    if (mode === 'loaded')
      assert.equal(await promise, 'source')
    else await assert.rejects(promise, /unreadable|threw|cancelled/)
    for (const event of ['onload', 'onerror', 'onabort'])
      assert.equal(reader[event], null)
  }
})

test('preferences retain exact keys and string values and tolerate denied storage', () => {
  const values = new Map()
  const storage = () => ({
    getItem: key => values.get(key),
    setItem: (key, value) => values.set(key, value),
  })
  assert.equal(readPreference('ts', storage), false)
  assert.equal(writePreference('ts', true, storage), true)
  assert.equal(readPreference('ts', storage), true)
  assert.equal(values.get('ts'), 'true')
  writePreference('ts', false, storage)
  assert.equal(values.get('ts'), 'false')
  const denied = () => {
    throw new Error('Storage denied')
  }
  assert.equal(readPreference('prod', denied), false)
  assert.equal(writePreference('prod', true, denied), false)
})
