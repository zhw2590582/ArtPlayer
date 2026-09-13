import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Repository baseline test runner.
import test from 'node:test'
import vm from 'node:vm'
import { collectExamples, generateDocumentationSmoke } from '../../scripts/docs-smoke/generator.ts'
import { extractExamples } from '../../scripts/docs-smoke/parser.ts'

const root = process.cwd()
const old = execFileSync('git', ['show', 'd74ecc43ccee99dcd2e3090356a6fb761825e6af:scripts/build-test.js'], {
  encoding: 'utf8',
})
const oldDefinitions = old.slice(0, old.indexOf('// Main execution')).replace(/^import .*$/gm, '')
const marker = '<div className="run-code">Run Code</div>'
const fence = code => `${marker}\n\n\`\`\`js{2}\n${code}\n\`\`\`\n`

test('Markdown tokens keep all 233 current examples identical after LF normalization', () => {
  const examples = collectExamples('packages/artplayer-vitepress/docs')
  const context = vm.createContext({ fs, path, console: { warn() {} } })
  vm.runInContext(oldDefinitions, context)
  for (const file of new Set(examples.map(example => example.file))) {
    context.content = fs.readFileSync(`packages/artplayer-vitepress/docs/${file}`, 'utf8').replaceAll('\r\n', '\n')
    const oldCodes = vm.runInContext(
      'JSON.stringify(extractCodeBlocks(content, "current.md").map(item => item.code))',
      context,
      { timeout: 1000 },
    )
    assert.deepEqual(
      examples.filter(example => example.file === file).map(example => example.code),
      JSON.parse(oldCodes),
    )
  }
  assert.equal(examples.length, 233)
  assert.equal(new Set(examples.map(example => example.id)).size, examples.length)
})

test('Malformed historical regex loops; new parsing terminates and syntax validation rejects it', () => {
  const content = fence('var valid = 1;\n## misplaced heading\nvar more = 2;')
  const context = vm.createContext({ fs, path, content, console: { warn() {} } })
  vm.runInContext(oldDefinitions, context)
  assert.throws(() => vm.runInContext('extractCodeBlocks(content, "broken.md")', context, { timeout: 100 }), {
    code: 'ERR_SCRIPT_EXECUTION_TIMEOUT',
  })
  const [example] = extractExamples(content, 'broken.md')
  assert.throws(() => new vm.Script(example.code, { filename: example.id }), SyntaxError)
  assert.throws(
    () => extractExamples(`${marker}\n\n\`\`\`js\nvar unfinished = 1;`, 'unclosed.md'),
    /unclosed.md:1: Unclosed/,
  )
})

test('Markdown syntax handles CRLF and ignores markers inside ordinary code fences', () => {
  const content = `\`\`\`html\n${marker}\n\`\`\`\n${fence('const value = "\\n## inside a JS string";')}`
  const result = extractExamples(content.replaceAll('\n', '\r\n'), 'quoted.md')
  assert.equal(result.length, 1)
  assert.equal(result[0].line, 7)
  assert.throws(() => extractExamples(marker, 'missing.md'), /must be followed/)
  assert.throws(() => extractExamples(fence('').replace('js{2}', 'css'), 'wrong.md'), /JavaScript fence/)
  assert.throws(() => extractExamples(fence(''), 'empty.md'), /Empty/)
})

test('Smoke output is deterministic and includes isolation instead of the old 100ms completion', async () => {
  const first = await generateDocumentationSmoke(root)
  assert.deepEqual(await generateDocumentationSmoke(root), first)
  assert(!first.get('docs/test/test.js').includes('Generated at:'))
  assert(!first.get('docs/test/test.js').includes('setTimeout(() => done(), 100)'))
  const data = JSON.parse(first.get('docs/test/examples.json'))
  assert.equal(data.examples.length, 233)
  assert.equal(data.scripts.length, 11)
  assert(data.scope.includes('Not complete feature'))
  const registered = []
  const context = vm.createContext({
    describe(_name, callback) {
      callback.call({ timeout() {} })
    },
    it(name, callback) {
      registered.push({ name, callback })
    },
  })
  vm.runInContext(first.get('docs/test/test.js'), context)
  assert.deepEqual(
    registered.map(item => item.name),
    data.examples.map(item => item.id),
  )
  assert(registered.every(item => typeof item.callback === 'function'))
})

test('CLI checks drift and validates all source examples before changing any output', () => {
  const directory = fs.mkdtempSync(path.join(root, 'refactor/.cache/docs-smoke-test-'))
  try {
    fs.mkdirSync(path.join(directory, 'packages/artplayer-vitepress/docs'), { recursive: true })
    fs.mkdirSync(path.join(directory, 'docs/test'), { recursive: true })
    fs.cpSync(path.join(root, 'scripts/docs-smoke'), path.join(directory, 'scripts/docs-smoke'), { recursive: true })
    const source = path.join(directory, 'packages/artplayer-vitepress/docs/index.md')
    fs.writeFileSync(source, fence('var number = 1;'))
    fs.writeFileSync(path.join(directory, 'docs/test/index.html'), '<script src="../compiled/artplayer.js"></script>')
    const run = args =>
      spawnSync(process.execPath, [path.join(root, 'scripts/build-test.js'), ...args], {
        cwd: directory,
        encoding: 'utf8',
        timeout: 30000,
      })
    assert.equal(run([]).status, 0)
    assert.equal(run(['--check']).status, 0)
    const output = path.join(directory, 'docs/test/test.js')
    fs.appendFileSync(output, '// drift\n')
    const drift = run(['--check'])
    assert.notEqual(drift.status, 0)
    assert.match(drift.stderr, /Generated documentation smoke drift/)
    const preserved = fs.readFileSync(output)
    fs.writeFileSync(source, fence('const invalid = ;'))
    assert.notEqual(run([]).status, 0)
    assert.deepEqual(fs.readFileSync(output), preserved)
  }
  finally {
    assert(directory.startsWith(path.join(root, 'refactor/.cache/docs-smoke-test-')))
    fs.rmSync(directory, { recursive: true, force: true })
  }
})
