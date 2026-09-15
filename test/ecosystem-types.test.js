import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Tests repository consumer orchestration with real child processes.
import { test } from 'node:test'
import { ecosystemChecks, runConsumerCommand, verifyEcosystemScope } from '../scripts/consumers/ecosystem.ts'
import { consumerDirectory, removeConsumer, workspace } from '../scripts/package-consumer.mjs'

test('Installed type roster covers every library once and rejects omissions, duplicates and missing scripts', () => {
  assert.equal(verifyEcosystemScope(workspace).length, 21)
  assert.throws(() => verifyEcosystemScope(workspace, ecosystemChecks.slice(1)), /Every library package/)
  assert.throws(() => verifyEcosystemScope(workspace, [...ecosystemChecks, ecosystemChecks[0]]), /Every library package/)
  const missing = ecosystemChecks.map(check => ({ ...check }))
  missing[0].script = 'test:missing-consumer'
  assert.throws(() => verifyEcosystemScope(workspace, missing), /Missing consumer command/)
})

test('Consumer child failures retain both output streams and actual exit status', async () => {
  const dir = consumerDirectory()
  try {
    const log = path.join(dir, 'failed.log')
    const failed = await runConsumerCommand(process.execPath, ['-e', 'console.log("before failure"); console.error("type mismatch"); process.exitCode=23'], dir, log)
    assert.equal(failed.code, 23)
    assert.equal(failed.signal, null)
    assert.match(fs.readFileSync(log, 'utf8'), /before failure[\s\S]*type mismatch/)
    const passed = await runConsumerCommand(process.execPath, ['-e', 'console.log("next package")'], dir, path.join(dir, 'next.log'))
    assert.equal(passed.code, 0)
    assert.match(fs.readFileSync(passed.log, 'utf8'), /next package/)
    const missing = await runConsumerCommand(path.join(dir, 'missing-executable'), [], dir, path.join(dir, 'missing.log'))
    assert.equal(missing.code, null)
    assert.match(missing.error, /ENOENT/)
  }
  finally { removeConsumer(dir) }
})

for (const failure of ['build', 'test:package']) {
  test(`Ecosystem command propagates ${failure} failure with the correct remaining scope`, async () => {
    const dir = consumerDirectory()
    try {
      const scripts = Object.fromEntries(ecosystemChecks.map(check => [check.script, 'controlled child']))
      fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ scripts }))
      for (const name of ecosystemChecks.flatMap(check => check.packages)) {
        const folder = path.join(dir, 'packages', name)
        fs.mkdirSync(folder, { recursive: true })
        fs.writeFileSync(path.join(folder, 'package.json'), JSON.stringify({ name }))
      }
      const yarn = path.join(dir, 'controlled-yarn.cjs')
      fs.writeFileSync(yarn, `console.log(process.argv.slice(2)); if (process.argv[2] === ${JSON.stringify(failure)}) process.exitCode = 29`)
      const launcher = path.join(dir, 'launch.mjs')
      fs.writeFileSync(launcher, `import { checkEcosystem } from ${JSON.stringify(new URL('../scripts/consumers/ecosystem.ts', import.meta.url).href)};
process.env.npm_config_user_agent = 'yarn/1.22.22';
process.env.npm_execpath = ${JSON.stringify(yarn)};
try { await checkEcosystem(${JSON.stringify(dir)}) } catch (error) { console.error(error); process.exitCode = 1 }
`)
      const result = await runConsumerCommand(process.execPath, [launcher], dir, path.join(dir, 'aggregate.log'))
      assert.equal(result.code, 1)
      const parent = path.join(dir, 'refactor/.cache/ecosystem-types')
      const [run] = fs.readdirSync(parent)
      const report = JSON.parse(fs.readFileSync(path.join(parent, run, 'report.json'), 'utf8'))
      if (failure === 'build') {
        assert.deepEqual(report.results.map(item => item.command), [['build:types'], ['build', 'all']])
        assert.deepEqual(report.results.map(item => item.outcome.code), [0, 29])
      }
      else {
        assert.equal(report.results.length, ecosystemChecks.length + 3)
        assert.deepEqual(report.results.slice(3).map(item => item.command[0]), ecosystemChecks.map(check => check.script))
        assert.equal(report.results.filter(item => item.outcome.code === 29).length, 1)
        assert(report.results.slice(4).every(item => item.outcome.code === 0))
      }
    }
    finally { removeConsumer(dir) }
  })
}
