import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Exercise real filesystem and workflow rejection paths.
import test from 'node:test'
import YAML from 'yaml'
import { validateCIWorkflow, validatePagesWorkflow } from '../refactor/scripts/ci-workflow.mjs'
import { compareCompiled, inside, inventory, validateArtifact } from '../scripts/pages/artifact.ts'

function fixture(t) {
  const root = fs.mkdtempSync(path.resolve('refactor/.cache/pages-test-'))
  t.after(() => {
    assert.equal(path.dirname(root), path.resolve('refactor/.cache'))
    assert(path.basename(root).startsWith('pages-test-'))
    fs.rmSync(root, { recursive: true, force: true })
  })
  fs.writeFileSync(path.join(root, 'CNAME'), 'github.artplayer.org\n')
  fs.writeFileSync(path.join(root, '.nojekyll'), '')
  fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html><title>Player</title>')
  return root
}
const contract = { domain: 'github.artplayer.org', requiredPaths: ['index.html', '.nojekyll', 'CNAME'] }

test('Pages preserves hidden files and rejects missing routes, empty pages and changed domains', (t) => {
  const root = fixture(t)
  const files = validateArtifact(root, contract)
  assert.equal(files['.nojekyll'].bytes, 0)
  assert.match(files['index.html'].sha256, /^[a-f0-9]{64}$/)
  assert.throws(() => validateArtifact(root, { ...contract, requiredPaths: [...contract.requiredPaths, 'mobile.html'] }), /Missing required/)
  fs.writeFileSync(path.join(root, 'CNAME'), 'example.com')
  assert.throws(() => validateArtifact(root, contract), /domain changed/)
  fs.writeFileSync(path.join(root, 'index.html'), '')
  assert.throws(() => validateArtifact(root, contract), /Empty Pages/)
})

test('Pages rejects directory escape, symbolic directories and hard-linked files', (t) => {
  const root = fixture(t)
  for (const file of ['../outside', '/outside', 'nested/../../outside', 'nested\\outside', '.'])
    assert.throws(() => inside(root, file))
  fs.linkSync(path.join(root, 'index.html'), path.join(root, 'hard.html'))
  assert.throws(() => inventory(root), /hard links/)
  fs.unlinkSync(path.join(root, 'hard.html'))
  const directory = path.join(root, 'assets')
  fs.mkdirSync(directory)
  fs.symlinkSync(directory, path.join(root, 'redirect'), 'junction')
  assert.throws(() => inventory(root), /symbolic links/)
})

test('Pages cannot upload stale compiled output or omit one distribution format', (t) => {
  const root = fixture(t)
  fs.mkdirSync(path.join(root, 'packages/artplayer/dist'), { recursive: true })
  fs.mkdirSync(path.join(root, 'compiled'))
  for (const suffix of ['.js', '.legacy.js', '.mjs']) {
    fs.writeFileSync(path.join(root, `packages/artplayer/dist/artplayer${suffix}`), suffix)
    fs.writeFileSync(path.join(root, `compiled/artplayer${suffix}`), suffix)
  }
  assert.equal(compareCompiled(root, root, ['artplayer']).length, 3)
  fs.writeFileSync(path.join(root, 'compiled/artplayer.js'), 'old')
  assert.throws(() => compareCompiled(root, root, ['artplayer']), /Stale compiled/)
  fs.unlinkSync(path.join(root, 'compiled/artplayer.js'))
  assert.throws(() => compareCompiled(root, root, ['artplayer']), /ENOENT/)
})

test('Pages deployment guard rejects untrusted, bypassed and rebuilding deployments', () => {
  const source = fs.readFileSync('.github/workflows/pages.yml', 'utf8')
  validatePagesWorkflow(source)
  for (const mutate of [
    w => w.on.push = {},
    w => w.jobs.validate.if = 'true',
    w => w.jobs.deploy.needs = [],
    w => w.jobs.deploy.permissions.contents = 'write',
    w => w.jobs.deploy.steps[0].with = { 'artifact-name': 'arbitrary' },
    w => w.jobs.deploy.steps.push({ run: 'yarn build' }),
    w => w.concurrency['cancel-in-progress'] = true,
  ]) {
    const workflow = YAML.parse(source)
    mutate(workflow)
    assert.throws(() => validatePagesWorkflow(YAML.stringify(workflow)))
  }
})

test('Pages upload cannot bypass preflight or upload the working directory', () => {
  const source = fs.readFileSync('.github/workflows/nodejs.yml', 'utf8')
  for (const mutate of [
    w => w.jobs.checks.steps.find(s => s.id === 'pages').if = 'false',
    w => w.jobs.checks.steps.find(s => s.uses?.startsWith('actions/upload-pages-artifact@')).with.path = 'docs',
    w => w.jobs.checks.steps.find(s => s.id === 'pages').run = 'echo passed',
    w => w.jobs.checks.steps.find(s => s.run?.startsWith('yarn test:pages:browser')).if = 'false',
  ]) {
    const workflow = YAML.parse(source)
    mutate(workflow)
    assert.throws(() => validateCIWorkflow(YAML.stringify(workflow)))
  }
})
