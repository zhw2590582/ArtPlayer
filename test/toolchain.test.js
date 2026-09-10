import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise the real toolchain guard with isolated manifests.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))

test('toolchain guard rejects unlocked dependencies, competing locks and the wrong package manager', () => {
  const cache = path.join(root, 'refactor/.cache')
  fs.mkdirSync(cache, { recursive: true })
  const fixture = fs.mkdtempSync(path.join(cache, 'toolchain-check-'))
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const writeManifest = value => fs.writeFileSync(path.join(fixture, 'package.json'), JSON.stringify(value))
  const run = (args = [], userAgent = 'yarn/1.22.22') => spawnSync(process.execPath, [path.join(fixture, 'scripts/check-toolchain.mjs'), ...args], {
    encoding: 'utf8',
    env: { ...process.env, npm_config_user_agent: userAgent },
  })
  try {
    fs.mkdirSync(path.join(fixture, 'scripts'))
    fs.mkdirSync(path.join(fixture, 'packages/example'), { recursive: true })
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'junction')
    for (const file of ['yarn.lock', 'scripts/check-toolchain.mjs'])
      fs.copyFileSync(path.join(root, file), path.join(fixture, file))
    fs.writeFileSync(path.join(fixture, '.node-version'), process.versions.node)
    fs.writeFileSync(path.join(fixture, 'packages/example/package.json'), JSON.stringify({ name: 'example', dependencies: { 'option-validator': '^2.0.6' } }))
    writeManifest(manifest)
    assert.equal(run(['--strict']).status, 0)

    writeManifest({ ...manifest, devDependencies: { ...manifest.devDependencies, 'unlocked-tool': '1.0.0' } })
    assert.match(run().stderr, /Lock resolution differs: unlocked-tool/)
    writeManifest(manifest)
    fs.writeFileSync(path.join(fixture, 'packages/example/package.json'), JSON.stringify({ name: 'example', dependencies: { 'option-validator': '^99.0.0' } }))
    assert.match(run().stderr, /Dependency missing from Yarn lock: option-validator/)
    fs.writeFileSync(path.join(fixture, 'packages/example/package.json'), JSON.stringify({ name: 'example' }))

    fs.writeFileSync(path.join(fixture, 'package-lock.json'), '{}')
    assert.match(run().stderr, /Maintain yarn.lock only/)
    fs.unlinkSync(path.join(fixture, 'package-lock.json'))
    assert.match(run(['--strict'], 'npm/11.19.0').stderr, /Run yarn check:toolchain/)
    assert.equal(run(['--strict']).status, 0)
  }
  finally {
    const relative = path.relative(cache, fixture)
    assert(relative.startsWith('toolchain-check-') && !relative.includes(path.sep))
    fs.rmSync(fixture, { recursive: true, force: true })
  }
})
