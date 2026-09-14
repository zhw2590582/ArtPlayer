import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise scaffold rollback and actual generated consumers.
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { parseHTML } from 'linkedom'
import { createPlugin } from '../scripts/plugin/cli.ts'
import { publishPlugin } from '../scripts/plugin/publish.ts'
import { renderPlugin } from '../scripts/plugin/render.ts'

const repository = fileURLToPath(new URL('../', import.meta.url))
const cache = path.join(repository, 'refactor/.cache')
const baseline = '07d5bfef2e815e8038362bb836b9c496c7ef9862'
const name = 'scaffold-test'
const packageName = `artplayer-plugin-${name}`

function fixture(t) {
  fs.mkdirSync(cache, { recursive: true })
  const root = fs.mkdtempSync(path.join(cache, 'plugin-scaffold-'))
  fs.mkdirSync(path.join(root, 'packages'))
  t.after(() => {
    assert.equal(fs.realpathSync(root), root)
    assert.equal(path.dirname(root), fs.realpathSync(cache))
    assert.ok(path.basename(root).startsWith('plugin-scaffold-'))
    fs.rmSync(root, { recursive: true, force: true })
  })
  return root
}

function write(root, relative, text) {
  const file = path.join(root, relative)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, text)
  return file
}

function run(args, cwd) {
  const env = { ...process.env }
  delete env.NODE_TEST_CONTEXT
  const result = spawnSync(process.execPath, args, { cwd, env, encoding: 'utf8', timeout: 120000 })
  assert.equal(result.status, 0, `${args.join(' ')}\n${result.stdout}\n${result.stderr}\n${result.error || ''}`)
  return result.stdout
}

test('historical generator overwrites an existing example and produces a mismatched demo link', (t) => {
  const root = fixture(t)
  const files = execFileSync('git', ['ls-tree', '-r', '--name-only', baseline, 'scripts/plugin'], { cwd: repository, encoding: 'utf8' }).trim().split(/\r?\n/)
  for (const relative of files)
    write(root, relative, execFileSync('git', ['show', `${baseline}:${relative}`], { cwd: repository }))
  write(root, 'package.json', '{"type":"module"}')
  const example = write(root, 'docs/assets/example/scaffold.test.js', '// owned example')
  run(['scripts/plugin/create.js', name], root)
  assert.notEqual(fs.readFileSync(example, 'utf8'), '// owned example')
  const readme = fs.readFileSync(path.join(root, `packages/${packageName}/README.md`), 'utf8')
  assert.match(readme, /example=scaffold-test/)
  assert.equal(fs.existsSync(path.join(root, 'docs/assets/example/scaffold-test.js')), false)
})

test('rendering creates consistent names and deterministic typed templates without writing', () => {
  const files = renderPlugin(name)
  assert.deepEqual(files, renderPlugin(name))
  assert.ok(files.has(`packages/${packageName}/src/index.ts`))
  assert.ok(files.has('docs/assets/example/scaffold.test.js'))
  assert.match(files.get(`packages/${packageName}/README.md`), /example=scaffold.test/)
  for (const [file, content] of files) {
    assert.doesNotMatch(file, /\{\{|\.tpl$/)
    assert.doesNotMatch(content, /\{\{/)
  }
  for (const invalid of ['', '-', '-name', 'name-', 'two--words', '../escape', 'Upper', 'foo/bar', 'a_b'])
    assert.throws(() => renderPlugin(invalid), /lowercase/)
})

test('unknown placeholders and duplicate rendered paths fail before publishing', (t) => {
  const root = fixture(t)
  const template = path.join(root, 'template')
  write(root, 'template/index.ts.tpl', '{{toString}}')
  assert.throws(() => renderPlugin(name, template), /Unknown template placeholder/)
  fs.writeFileSync(path.join(template, 'index.ts.tpl'), 'export {}')
  write(root, 'template/index.ts', 'export {}')
  assert.throws(() => renderPlugin(name, template), /Duplicate template output/)
  assert.deepEqual(fs.readdirSync(path.join(root, 'packages')), [])
})

test('existing packages and examples are preserved including empty package directories', (t) => {
  const root = fixture(t)
  const example = write(root, 'docs/assets/example/scaffold.test.js', '// owned example')
  assert.throws(() => publishPlugin(root, name, renderPlugin(name)), /overwrite/)
  assert.equal(fs.readFileSync(example, 'utf8'), '// owned example')
  assert.deepEqual(fs.readdirSync(path.join(root, 'packages')), [])
  fs.mkdirSync(path.join(root, `packages/${packageName}`))
  assert.throws(() => publishPlugin(root, name, renderPlugin(name)), /already exists/)
})

test('partial write failure removes only generated files and newly created directories', (t) => {
  const root = fixture(t)
  const sentinel = write(root, 'docs/keep.txt', 'keep')
  let count = 0
  assert.throws(() => publishPlugin(root, name, renderPlugin(name), (from, to) => {
    if (++count === 5)
      throw new Error('injected write failure')
    fs.linkSync(from, to)
  }), /injected write failure/)
  assert.deepEqual(fs.readdirSync(path.join(root, 'packages')), [])
  assert.deepEqual(fs.readdirSync(path.join(root, 'docs')), ['keep.txt'])
  assert.equal(fs.readFileSync(sentinel, 'utf8'), 'keep')
})

test('a concurrent example collision cannot overwrite the other writer', (t) => {
  const root = fixture(t)
  assert.throws(() => publishPlugin(root, name, renderPlugin(name), (from, to) => {
    if (to.endsWith('scaffold.test.js'))
      fs.writeFileSync(to, '// concurrent writer', { flag: 'wx' })
    fs.linkSync(from, to)
  }), /preserve changed outputs/)
  assert.deepEqual(fs.readdirSync(path.join(root, 'packages')), [])
  assert.equal(fs.readFileSync(path.join(root, 'docs/assets/example/scaffold.test.js'), 'utf8'), '// concurrent writer')
})

test('rollback retains an externally edited generated file and reports its recovery path', (t) => {
  const root = fixture(t)
  let first
  assert.throws(() => publishPlugin(root, name, renderPlugin(name), (from, to) => {
    if (first) {
      fs.writeFileSync(first, 'external edit')
      throw new Error('injected interruption')
    }
    fs.linkSync(from, to)
    first = to
  }), error => error.message.includes(first) && error.cause.message === 'injected interruption')
  assert.equal(fs.readFileSync(first, 'utf8'), 'external edit')
  assert.deepEqual(fs.readdirSync(path.join(root, 'packages')), [packageName])
})

test('redirected output directories are rejected before writing through them', (t) => {
  const root = fixture(t)
  const outside = fixture(t)
  fs.symlinkSync(outside, path.join(root, 'docs'), 'junction')
  assert.throws(() => publishPlugin(root, name, renderPlugin(name)), /redirected output/)
  assert.deepEqual(fs.readdirSync(outside), ['packages'])
  assert.deepEqual(fs.readdirSync(path.join(root, 'packages')), [])
  fs.unlinkSync(path.join(root, 'docs'))
})

test('CLI validates arguments and builds a complete package without installing or changing the lock', (t) => {
  const root = fixture(t)
  const lock = write(root, 'yarn.lock', '# existing lock\n')
  assert.throws(() => createPlugin(root, [name, 'extra']), /exactly one/)
  createPlugin(root, ['--help'])
  assert.deepEqual(fs.readdirSync(path.join(root, 'packages')), [])
  createPlugin(root, [name])
  assert.equal(fs.readFileSync(lock, 'utf8'), '# existing lock\n')
  for (const [relative, content] of renderPlugin(name))
    assert.equal(fs.readFileSync(path.join(root, relative), 'utf8'), content)
})

test('legacy CLI path uses its repository root even when launched from another working directory', (t) => {
  const root = fixture(t)
  const elsewhere = fixture(t)
  fs.cpSync(path.join(repository, 'scripts/plugin'), path.join(root, 'scripts/plugin'), { recursive: true })
  write(root, 'package.json', '{"type":"module"}')
  const command = path.join(root, 'scripts/plugin/create.js')
  run([command, name], elsewhere)
  assert.ok(fs.existsSync(path.join(root, `packages/${packageName}/src/index.ts`)))
  assert.deepEqual(fs.readdirSync(path.join(elsewhere, 'packages')), [])
  const invalid = spawnSync(process.execPath, [command, '../escape'], { cwd: elsewhere, encoding: 'utf8' })
  assert.equal(invalid.status, 1)
  assert.match(invalid.stderr, /lowercase/)
})

test('generated package passes real production builds, consumers, strict types and stylesheet lifecycle', (t) => {
  const root = fixture(t)
  createPlugin(root, [name])
  fs.copyFileSync(path.join(repository, 'tsconfig.base.json'), path.join(root, 'tsconfig.base.json'))
  const pkg = path.join(root, `packages/${packageName}`)
  const compiler = path.join(repository, 'node_modules/typescript/bin/tsc')
  run([path.join(repository, 'node_modules/eslint/bin/eslint.js'), '--no-ignore', '--max-warnings', '0', 'src', 'types', 'test/plugin.test.mjs', 'package.json'], pkg)
  run([compiler, '-p', 'tsconfig.json', '--noEmit'], pkg)
  const output = run([path.join(repository, 'scripts/build.js'), packageName], root)
  assert.match(output, /Finished building 1 package/)
  const testOutput = run(['--test', 'test/plugin.test.mjs'], pkg)
  assert.match(testOutput, /pass 1/)
  const consumer = `import plugin from '${packageName}'
import legacy from '${packageName}/legacy'
import type Artplayer from 'artplayer'
declare const art: Artplayer
const result: {name:'artplayerPluginScaffoldTest'} = plugin({})(art)
legacy.default()(art)
// @ts-expect-error The scaffold owns no option fields yet.
plugin({unknown: true})
// @ts-expect-error Registration requires an ArtPlayer instance.
plugin()({})
void result
`
  write(pkg, 'test/consumer.mts', consumer)
  write(pkg, 'test/consumer.cts', consumer.replace(`import plugin from '${packageName}'`, `import plugin = require('${packageName}')`))
  write(pkg, 'test/tsconfig.json', JSON.stringify({ compilerOptions: { strict: true, noEmit: true, types: [], module: 'NodeNext', moduleResolution: 'NodeNext', target: 'ES2020', esModuleInterop: true }, include: ['consumer.mts', 'consumer.cts'] }))
  run([compiler, '-p', 'test/tsconfig.json'], pkg)
  write(pkg, 'test/classic.ts', consumer.replaceAll(`'${packageName}/legacy'`, `'../types/${packageName}'`).replaceAll(`'${packageName}'`, `'../types/${packageName}'`))
  write(pkg, 'test/tsconfig.classic.json', JSON.stringify({ compilerOptions: { strict: true, noEmit: true, types: [], module: 'CommonJS', moduleResolution: 'Node', target: 'ES2020', esModuleInterop: true }, files: ['classic.ts'] }))
  run([path.join(repository, 'node_modules/typescript-compat/bin/tsc'), '-p', 'test/tsconfig.classic.json'], pkg)
  const { document } = parseHTML('<html><head></head><body></body></html>')
  const context = vm.createContext({ document })
  for (const suffix of ['.js', '.legacy.js']) {
    const code = fs.readFileSync(path.join(pkg, `dist/${packageName}${suffix}`), 'utf8')
    vm.runInNewContext(code, {}) // Importing the UMD bundle without a DOM must work.
    vm.runInContext(code, context)
    vm.runInContext(code, context)
    assert.equal(context.artplayerPluginScaffoldTest.default, context.artplayerPluginScaffoldTest)
    assert.equal(context.artplayerPluginScaffoldTest()({}).name, 'artplayerPluginScaffoldTest')
  }
  assert.equal(document.querySelectorAll(`style#${packageName}`).length, 1)
})
