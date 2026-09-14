import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash } from './releases.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const parent = path.join(root, 'refactor/.cache/bun-evaluation')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
assert.equal(process.versions.node, fs.readFileSync(path.join(root, '.node-version'), 'utf8').trim())
const phase = process.argv[2]
assert(['prepare', 'yarn', 'bun-frozen', 'bun-migrate', 'bun-repeat'].includes(phase), 'Use prepare, yarn, bun-frozen, bun-migrate or bun-repeat')
fs.mkdirSync(parent, { recursive: true })

if (phase === 'prepare') {
  assert.equal(process.argv.length, 3)
  const output = fs.mkdtempSync(path.join(parent, 'run-'))
  const checkoutRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-install-'))
  assert(!path.resolve(checkoutRoot).startsWith(path.resolve(root)), 'Install checkouts must stay outside the repository')
  const source = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', windowsHide: true }).trim()
  const snapshot = { task: 'MOD-01', source, createdAt: new Date().toISOString(), node: process.versions.node, checkoutRoot, scope: 'Detached checkouts outside the repository with independent node_modules; default Yarn unchanged', rootFilesAtPreparation: {}, checkouts: {}, sourceFiles: {} }
  for (const file of ['package.json', 'yarn.lock']) snapshot.rootFilesAtPreparation[file] = hash(fs.readFileSync(path.join(root, file)))
  for (const name of ['yarn', 'bun-frozen', 'bun-migrate']) {
    const checkout = path.join(checkoutRoot, name)
    const log = execFileSync('git', ['-c', 'core.autocrlf=false', '-c', 'core.eol=lf', 'worktree', 'add', '--detach', checkout, source], { cwd: root, encoding: 'utf8', windowsHide: true })
    fs.writeFileSync(path.join(output, `${name}-checkout.log`), log)
    assert(!fs.existsSync(path.join(checkout, 'node_modules')))
    snapshot.checkouts[name] = checkout
    snapshot.sourceFiles[name] = Object.fromEntries(['package.json', 'yarn.lock'].map(file => [file, hash(fs.readFileSync(path.join(checkout, file)))]))
  }
  write(path.join(output, 'snapshot.json'), snapshot)
  write(path.join(parent, 'latest.json'), { output: path.relative(root, output).replaceAll('\\', '/') })
  console.log(`Prepared isolated install comparison: ${output}`)
}
else {
  const output = fs.realpathSync(path.resolve(root, process.argv[3] || ''))
  assert.equal(path.dirname(output), fs.realpathSync(parent), 'Use a direct evaluation directory')
  const snapshot = read(path.join(output, 'snapshot.json'))
  const checkoutPhase = phase === 'bun-repeat' ? 'bun-migrate' : phase
  const checkout = fs.realpathSync(snapshot.checkouts[checkoutPhase])
  assert.equal(path.dirname(checkout), fs.realpathSync(snapshot.checkoutRoot))
  assert(!checkout.startsWith(fs.realpathSync(root) + path.sep), 'Install checkout must not inherit the original node_modules')
  assert.equal(path.basename(checkout), checkoutPhase)
  if (phase === 'bun-repeat')
    assert(fs.existsSync(path.join(checkout, 'bun.lock')), 'Repeat requires the generated Bun lock')
  else
    assert(!fs.existsSync(path.join(checkout, 'node_modules')), 'Initial installation requires a clean checkout')
  const executable = phase === 'yarn' ? process.execPath : fs.realpathSync(process.argv[4] || '')
  const yarn = process.env.npm_execpath
  if (phase === 'yarn') {
    assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Run through pinned Yarn')
    assert(yarn && fs.existsSync(yarn))
  }
  else {
    assert.equal(execFileSync(executable, ['--version'], { encoding: 'utf8', windowsHide: true }).trim(), '1.4.2', 'This evaluation pins Bun 1.4.2')
  }
  const cache = process.env.ARTPLAYER_EVAL_CACHE ? fs.realpathSync(process.env.ARTPLAYER_EVAL_CACHE) : path.join(output, `${phase}-cache`)
  assert(path.resolve(cache).startsWith(fs.realpathSync(parent) + path.sep), 'Keep install caches inside the evaluation area')
  const coldPackageCache = !fs.existsSync(cache) || fs.readdirSync(cache).length === 0
  const args = phase === 'yarn'
    ? [yarn, 'install', '--frozen-lockfile', '--non-interactive', '--cache-folder', cache]
    : ['install', ...(['bun-frozen', 'bun-repeat'].includes(phase) ? ['--frozen-lockfile'] : []), '--cache-dir', cache, '--backend=copyfile']
  const guardedFiles = ['package.json', 'yarn.lock', ...(phase === 'bun-repeat' ? ['bun.lock'] : [])]
  const identities = Object.fromEntries(guardedFiles.map(file => [file, hash(fs.readFileSync(path.join(checkout, file)))]))
  const start = performance.now()
  const log = fs.openSync(path.join(output, `${phase}-install.log`), 'wx')
  let result
  try {
    result = spawnSync(executable, args, { cwd: checkout, encoding: 'utf8', stdio: ['ignore', log, log], timeout: 600000, windowsHide: true, env: { ...process.env, NODE_PATH: '', PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1', BUN_TELEMETRY: '0' } })
  }
  finally { fs.closeSync(log) }
  const after = Object.fromEntries(Object.keys(identities).map(file => [file, hash(fs.readFileSync(path.join(checkout, file)))]))
  assert.deepEqual(after, identities, 'Evaluation modified source manifest or Yarn lock')
  const record = { task: 'MOD-01', phase, source: snapshot.source, node: process.versions.node, executable, args, durationMs: performance.now() - start, exitCode: result.status, signal: result.signal, error: result.error?.message, sourceFilesUnchanged: true, bunLock: fs.existsSync(path.join(checkout, 'bun.lock')) ? hash(fs.readFileSync(path.join(checkout, 'bun.lock'))) : null, log: `${phase}-install.log`, coldPackageCache, browserDownloadExcluded: true }
  write(path.join(output, `${phase}-install.json`), record)
  console.log(JSON.stringify(record))
  process.exitCode = result.status ?? 1
}
