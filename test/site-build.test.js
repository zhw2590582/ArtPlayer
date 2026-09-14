import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Exercise real build outputs and failure recovery.
import test from 'node:test'
import { pathToFileURL } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'
import {
  stageArtifacts,
  treeFingerprint,
} from '../scripts/site-build/artifacts.ts'
import { buildLanguages, languageEntries } from '../scripts/site-build/i18n.ts'
import { loadModules } from './helpers/load.js'

const cache = path.resolve('refactor/.cache')
const outputs = ['packages/artplayer/dist/i18n', 'docs/compiled/i18n']
function fixture() {
  const root = fs.mkdtempSync(path.join(cache, 'site-build-test-'))
  for (const output of outputs) {
    fs.mkdirSync(path.join(root, output), { recursive: true })
    fs.writeFileSync(path.join(root, output, 'old.js'), 'Old complete output')
  }
  return root
}
function remove(root) {
  assert.equal(path.dirname(fs.realpathSync(root)), cache)
  assert(path.basename(root).startsWith('site-build-test-'))
  fs.rmSync(root, { recursive: true, force: true })
}
function snapshot(root) {
  return outputs.map(output => treeFingerprint(path.join(root, output)))
}

test('old i18n builder destroys the existing distribution before a compile failure', async () => {
  const root = fixture()
  try {
    const source = execFileSync(
      'git',
      [
        'show',
        '078cd9ef72d8b908ef178d650fe0b8c87f867f2a:scripts/build-i18n.js',
      ],
      { encoding: 'utf8' },
    )
    const ast = ts.createSourceFile(
      'old.js',
      source,
      ts.ScriptTarget.Latest,
      true,
    )
    const code = ast.statements
      .find(
        node =>
          ts.isFunctionDeclaration(node) && node.name.text === 'buildI18n',
      )
      .getText(ast)
    const distDir = path.join(root, outputs[0])
    const before = snapshot(root)
    await assert.rejects(
      vm.runInNewContext(`${code}; buildI18n()`, {
        fs: {
          ...fs,
          rmSync(file, options) {
            assert.equal(file, distDir)
            fs.rmSync(file, options)
          },
        },
        path,
        distDir,
        entries: ['ar.ts'],
        toPascalCase: value => value,
        getViteBuildConfig: () => ({}),
        viteBuild: async () => {
          throw new Error('Compile failure')
        },
      }),
      /Compile failure/,
    )
    assert.notEqual(snapshot(root)[0], before[0])
    assert.equal(snapshot(root)[1], before[1])
  }
  finally {
    remove(root)
  }
})

test('staging isolates failed builds, rejects empty output and rolls back a later rename failure', async () => {
  const root = fixture()
  try {
    const before = snapshot(root)
    for (const mode of ['compile', 'empty', 'rename']) {
      let moves = 0
      await assert.rejects(
        stageArtifacts(
          root,
          'i18n',
          async (stages) => {
            assert.deepEqual(snapshot(root), before)
            if (mode === 'empty')
              return
            for (const stage of stages)
              fs.writeFileSync(path.join(stage, 'new.js'), 'New output')
            if (mode === 'compile')
              throw new Error('Compile failure')
          },
          (source, target) => {
            if (++moves === 4)
              throw new Error('Fourth rename failed')
            fs.renameSync(source, target)
          },
        ),
      )
      assert.deepEqual(snapshot(root), before)
      assert.deepEqual(
        fs.readdirSync(path.join(root, 'refactor/.cache/site-build')),
        [],
      )
    }
    await stageArtifacts(root, 'i18n', async (stages) => {
      for (const stage of stages)
        fs.writeFileSync(path.join(stage, 'new.js'), 'New output')
    })
    for (const output of outputs)
      assert.deepEqual(fs.readdirSync(path.join(root, output)), ['new.js'])
  }
  finally {
    remove(root)
  }
})

test('a competing build is rejected and an output edited during compile is preserved', async () => {
  const root = fixture()
  try {
    await assert.rejects(
      stageArtifacts(root, 'i18n', async (stages) => {
        await assert.rejects(
          stageArtifacts(root, 'i18n', async () => {}),
          /EEXIST/,
        )
        for (const stage of stages)
          fs.writeFileSync(path.join(stage, 'new.js'), 'New')
        fs.writeFileSync(
          path.join(root, outputs[0], 'manual.js'),
          'Concurrent author',
        )
      }),
      /changed while building/,
    )
    assert.equal(
      fs.readFileSync(path.join(root, outputs[0], 'manual.js'), 'utf8'),
      'Concurrent author',
    )
    assert.equal(
      fs.readFileSync(path.join(root, outputs[1], 'old.js'), 'utf8'),
      'Old complete output',
    )
  }
  finally {
    remove(root)
  }
})

test('rollback conflict retains original backup instead of overwriting an external artifact edit', async () => {
  const root = fixture()
  try {
    let moves = 0
    await assert.rejects(
      stageArtifacts(
        root,
        'i18n',
        async (stages) => {
          for (const stage of stages)
            fs.writeFileSync(path.join(stage, 'new.js'), 'Candidate')
        },
        (source, target) => {
          if (++moves === 4) {
            fs.writeFileSync(
              path.join(root, outputs[0], 'new.js'),
              'Concurrent edit',
            )
            throw new Error('Injected later replacement failure')
          }
          fs.renameSync(source, target)
        },
      ),
      /retained backups/,
    )
    const runs = fs.readdirSync(path.join(root, 'refactor/.cache/site-build'))
    assert.equal(runs.length, 1)
    assert.equal(
      fs.readFileSync(
        path.join(
          root,
          'refactor/.cache/site-build',
          runs[0],
          'backup-0/old.js',
        ),
        'utf8',
      ),
      'Old complete output',
    )
    assert.equal(
      fs.readFileSync(path.join(root, outputs[0], 'new.js'), 'utf8'),
      'Concurrent edit',
    )
    assert.equal(
      fs.readFileSync(path.join(root, outputs[1], 'old.js'), 'utf8'),
      'Old complete output',
    )
  }
  finally {
    remove(root)
  }
})

test('actual language builds preserve every UMD/CJS/AMD/ESM dictionary and historical window alias', async () => {
  const root = fixture()
  try {
    const sourceDir = path.join(root, 'packages/artplayer/src/i18n')
    fs.cpSync(path.resolve('packages/artplayer/src/i18n'), sourceDir, {
      recursive: true,
    })
    const entries = languageEntries(root)
    assert.equal(entries.length, 11)
    await buildLanguages(root)
    assert.equal(snapshot(root)[0], snapshot(root)[1])
    for (const entry of entries) {
      const name = path.basename(entry, '.ts')
      const { language: source } = await loadModules(
        { language: `packages/artplayer/src/i18n/${name}` },
        root,
      )
      const code = fs.readFileSync(
        path.join(root, outputs[0], `${name}.js`),
        'utf8',
      )
      const globalName = `artplayerI18n${name.replace(/(^|-)([a-z])/g, (_match, _prefix, char) => char.toUpperCase())}`
      for (const mode of ['global', 'cjs', 'amd']) {
        let amd
        const define = (factory) => {
          amd = factory()
        }
        define.amd = {}
        const context = {
          window: {},
          ...(mode === 'cjs' ? { exports: {}, module: { exports: {} } } : {}),
          ...(mode === 'amd' ? { define } : {}),
        }
        vm.runInNewContext(code, context)
        const result
          = mode === 'amd'
            ? amd
            : mode === 'cjs'
              ? context.module.exports
              : context[globalName]
        assert.deepEqual(
          JSON.parse(JSON.stringify(result)),
          source,
          `${name}/${mode}`,
        )
        assert.equal(context.window[`artplayer-i18n-${name}`], result)
      }
      const previousWindow = Object.getOwnPropertyDescriptor(
        globalThis,
        'window',
      )
      try {
        globalThis.window = {}
        const esm = await import(
          pathToFileURL(path.join(root, outputs[0], `${name}.mjs`)).href,
        )
        assert.deepEqual(esm.default, source)
        assert.equal(window[`artplayer-i18n-${name}`], esm.default)
      }
      finally {
        if (previousWindow)
          Object.defineProperty(globalThis, 'window', previousWindow)
        else delete globalThis.window
      }
    }
    fs.writeFileSync(path.join(sourceDir, 'ar.js'), 'export default {}')
    assert.throws(() => languageEntries(root), /Duplicate JS\/TS/)
    fs.unlinkSync(path.join(sourceDir, 'ar.js'))
    fs.writeFileSync(
      path.join(sourceDir, 'ar.ts'),
      'export default invalid syntax',
    )
    const before = snapshot(root)
    await assert.rejects(buildLanguages(root))
    assert.deepEqual(snapshot(root), before)
  }
  finally {
    remove(root)
  }
})
