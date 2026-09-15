import fs from 'node:fs'
import { expect, test } from './fixtures.js'

const cases = JSON.parse(fs.readFileSync('refactor/baselines/monaco-node-path-fixtures.json', 'utf8'))

test('docs Monaco path port preserves frozen Node path results in both namespaces', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async (cases) => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    const load = ids => new Promise((resolve, reject) => window.require(ids, (...modules) => resolve(modules), reject))
    await load(['vs/editor/editor.main'])
    const [paths, process] = await load(['vs/base/common/path', 'vs/base/common/process'])
    const values = cases.map(entry => paths[entry.namespace][entry.method](...entry.args))
    const namespace = process.platform === 'win32' ? 'win32' : 'posix'
    const sample = namespace === 'win32' ? 'C:\\a\\..\\b' : '/a/../b'
    let invalid
    try {
      paths.normalize(42)
    }
    catch (error) {
      invalid = { name: error.name, code: error.code }
    }
    return { values, namespace, alias: paths.normalize(sample) === paths[namespace].normalize(sample), invalid }
  }, cases)
  expect(result.values).toEqual(cases.map(entry => entry.expected))
  expect(result.alias).toBe(true)
  // This is the retained VS Code Error subclass, not Node's TypeError wrapper.
  expect(result.invalid).toEqual({ name: 'Error', code: 'ERR_INVALID_ARG_TYPE' })
  await testInfo.attach('monaco-path-results', { contentType: 'application/json', body: JSON.stringify({ cases: cases.length, ...result }) })
})
