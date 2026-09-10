import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'
import vm from 'node:vm'
import { getEntryFile, parseProjects } from '../../scripts/projects.js'
import { createRebuildQueue } from '../../scripts/rebuild.js'
import { refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
test('Package CLI rejects ambiguous requests and never accepts inherited project names', () => {
  const projects = { artplayer: '.', 'artplayer-plugin-chapter': '.' }
  assert.deepEqual(parseProjects(['all'], projects, 'build').names, Object.keys(projects))
  assert.deepEqual(parseProjects(['artplayer', 'artplayer'], projects, 'build').names, ['artplayer'])
  assert.equal(parseProjects(['artplayer', '--no-open'], projects, 'dev').open, false)
  for (const args of [['all', 'artplayer'], ['constructor'], ['../artplayer'], ['--unknown']])
    assert.throws(() => parseProjects(args, projects, 'build'))
  assert.throws(() => parseProjects(Object.keys(projects), projects, 'dev'))
  assert.throws(() => parseProjects(['all'], projects, 'dev'))
})

test('Rebuild queue serializes changes and retries after failure', async () => {
  let release
  let start
  let count = 0
  const started = new Promise(resolve => { start = resolve })
  const first = new Promise(resolve => { release = resolve })
  const rebuild = createRebuildQueue(async () => {
    count++
    if (count === 1) {
      start()
      await first
    }
  })
  const pending = rebuild()
  await started
  assert.equal(rebuild(), pending)
  assert.equal(rebuild(), pending)
  assert.equal(count, 1)
  release()
  await pending
  assert.equal(count, 2)
  let fail = true
  const retry = createRebuildQueue(async () => {
    if (fail) throw new Error('invalid source')
  })
  await assert.rejects(retry(), /invalid source/)
  fail = false
  await retry()
})

test('Normal build CLI compiles TypeScript, JS, Less, SVG and inline worker into compatible formats', async () => {
  const parent = path.join(refactorDir, '.cache')
  fs.mkdirSync(parent, { recursive: true })
  const directory = fs.mkdtempSync(path.join(parent, 'build-check-'))
  const name = 'artplayer-plugin-build-probe'
  const project = path.join(directory, 'packages', name)
  const dist = path.join(project, 'dist')
  const run = args => spawnSync(process.execPath, [path.join(root, 'scripts/build.js'), ...args], { cwd: directory, encoding: 'utf8', timeout: 60000 })
  try {
    fs.mkdirSync(project, { recursive: true })
    fs.cpSync(path.join(refactorDir, 'fixtures/build'), path.join(project, 'src'), { recursive: true })
    fs.writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name, version: '1.0.0' }))
    fs.mkdirSync(dist)
    fs.writeFileSync(path.join(dist, 'preserve.txt'), 'keep until a valid build starts')
    assert.equal(run(['nonexistent']).status, 1)
    assert.equal(run([]).status, 1)
    fs.writeFileSync(path.join(project, 'src/index.js'), 'export default 1')
    assert.throws(() => getEntryFile(project), /exactly one/)
    assert.equal(run([name]).status, 1)
    assert(fs.existsSync(path.join(dist, 'preserve.txt')))
    fs.unlinkSync(path.join(project, 'src/index.js'))
    execFileSync(process.execPath, [path.join(root, 'scripts/build.js'), name], { cwd: directory, env: { ...process.env, NODE_ENV: 'production' }, encoding: 'utf8', timeout: 60000 })
    assert.deepEqual(fs.readdirSync(dist).sort(), [`${name}.js`, `${name}.legacy.js`, `${name}.mjs`])
    function check(factory) {
      assert.equal(factory().label, 'default')
      const result = factory({ label: 'verified' })
      assert.equal(result.label, 'verified')
      assert.equal(result.value, 42)
      assert.match(result.css, /#123abc/)
      assert.match(result.svg, /<svg/)
      assert.equal(typeof result.createWorker, 'function')
    }
    for (const extension of ['.js', '.legacy.js']) {
      const code = fs.readFileSync(path.join(dist, name + extension), 'utf8')
      assert.equal(fs.readFileSync(path.join(directory, 'docs/compiled', name + extension), 'utf8'), code)
      const cjs = { exports: {}, module: { exports: {} } }
      vm.runInNewContext(code, cjs)
      check(cjs.module.exports)
      const global = {}
      vm.runInNewContext(code, global)
      check(global.artplayerPluginBuildProbe)
      let exported
      const amd = { define: Object.assign(factory => { exported = factory() }, { amd: true }) }
      vm.runInNewContext(code, amd)
      assert.equal(exported, amd.artplayerPluginBuildProbe)
      check(exported)
    }
    check((await import(pathToFileURL(path.join(dist, `${name}.mjs`)))).default)
  }
  finally {
    const relative = path.relative(parent, directory)
    assert(relative.startsWith('build-check-') && !relative.includes(path.sep))
    fs.rmSync(directory, { recursive: true, force: true })
  }
})
