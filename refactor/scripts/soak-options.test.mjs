import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Soak validation runs without launching hours of browsers.
import test from 'node:test'
import { soakOptions } from '../../test/helpers/soak-options.js'

test('Default soak preserves the old duration and deadline; hour phases require enough uninterrupted media', () => {
  assert.deepEqual(soakOptions(undefined), { phaseSeconds: 90, minimumMediaSeconds: 600, timeoutMs: 270000 })
  const long = soakOptions('3600')
  assert.equal(long.phaseSeconds, 3600)
  assert.equal(long.minimumMediaSeconds, 10860)
  assert.equal(long.timeoutMs, 7290000)
  for (const value of ['', '0', '89', '90.5', '3601', 'Infinity', 'NaN', 'abc'])
    assert.throws(() => soakOptions(value), /whole seconds/)
})

test('Missing explicit artifacts fail before browser work', () => {
  const env = { ...process.env, ARTPLAYER_MB_SOAK_SECONDS: '3600' }
  delete env.ARTPLAYER_MB_ARTIFACT
  delete env.ARTPLAYER_BROWSER_ARTIFACTS
  delete env.ARTPLAYER_MB_BASELINE
  const result = spawnSync(process.execPath, ['test/soak/mediabunny.spec.js'], { cwd: process.cwd(), env, encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /explicit built artifact or verified installed artifact map/)
})

test('Hour phases reject the existing ten-minute fixture before launching a browser', (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-soak-options-'))
  t.after(() => {
    const resolved = fs.realpathSync(directory)
    assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()))
    assert(path.basename(resolved).startsWith('artplayer-soak-options-'))
    fs.rmSync(resolved, { recursive: true })
  })
  const artifact = path.join(directory, 'artifact.js')
  fs.writeFileSync(artifact, '// Not executed: media validation must reject first.\n')
  fs.writeFileSync(path.join(directory, 'manifest.json'), JSON.stringify({ duration: 600, files: {} }))
  const env = { ...process.env, ARTPLAYER_MB_SOAK_SECONDS: '3600', ARTPLAYER_MB_SOAK_MEDIA: directory, ARTPLAYER_MB_ARTIFACT: artifact }
  delete env.ARTPLAYER_BROWSER_ARTIFACTS
  delete env.ARTPLAYER_MB_BASELINE
  const result = spawnSync(process.execPath, ['test/soak/mediabunny.spec.js'], { cwd: process.cwd(), env, encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /at least 10860 seconds/)
})
