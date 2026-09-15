import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
const read = name => fs.readFileSync(path.join(root, name), 'utf8').replaceAll('\r\n', '\n')
function htmlFiles(dir = 'docs') {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const name = `${dir}/${entry.name}`
    if (entry.isDirectory())
      return ['compiled', 'uncompiled', 'node_modules'].includes(entry.name) ? [] : htmlFiles(name)
    return entry.name.endsWith('.html') ? [name] : []
  }).sort()
}
function menuLinks() {
  return [...read('docs/index.html').matchAll(/href="([^"\n]*[?&]example=[^"\n]*)"/g)].map(match => match[1].replaceAll('&amp;', '&'))
}
export function captureDemoInventory() {
  const links = menuLinks()
  const inventory = JSON.parse(read('refactor/package-inventory.json'))
  const examples = fs.readdirSync(path.join(root, 'docs/assets/example')).filter(name => name.endsWith('.js')).sort().map((file) => {
    const name = file.slice(0, -3)
    const source = `docs/assets/example/${file}`
    const linked = links.filter(link => new URL(link, 'http://localhost:8082').searchParams.get('example') === name)
    const libs = [...new Set(linked.flatMap(link => (new URL(link, 'http://localhost:8082').searchParams.get('libs') || '').split('\n').filter(Boolean)))]
    return { name, source, sha256Lf: hash(read(source)), menuLinks: linked, route: linked[0] || `/?example=${name}`, libs, status: 'not-run', owner: 'EX-03', note: name === 'thumbnail' ? 'References artplayer-plugin-thumbnail, which is absent from the 22 current workspace packages; dependency and route need reconciliation.' : linked.length ? 'Existing menu route; SDK and media loading have not been validated.' : 'No menu link; example route follows common.js loader. Required globals are not automatically loaded.' }
  })
  const pages = htmlFiles().map((source) => {
    const text = read(source)
    const uncommented = text.replace(/<!--[\s\S]*?-->/g, '')
    return { source, route: `/${source.slice(5)}`.replace(/index\.html$/, ''), sha256Lf: hash(text), kind: source.startsWith('docs/document/') ? 'generated-docs' : source.includes('googlebc') ? 'site-verification' : source === 'docs/upscaler/index.html' ? 'standalone-tool' : 'demo-or-editor', scriptSources: [...uncommented.matchAll(/<script\b[^>]+\bsrc=["']([^"']+)["']/g)].map(match => match[1]), status: 'not-run', owner: source.includes('googlebc') ? 'SITE-01' : 'EX-03' }
  })
  return { schemaVersion: 1, task: 'BASE-04', sourceCommit: '94893929', capturedAt: new Date().toISOString(), note: 'Historical source inventory, not browser or network evidence. ScriptSources excludes comments but does not resolve inline scripts, import maps or dynamic SDK loading. Hashes use LF and describe this capture; check validates coverage, not current content identity.', examples, pages, packages: inventory.packages.map(pkg => ({ name: pkg.name, examples: examples.filter(example => example.libs.some(lib => lib.includes(`/${pkg.name}/`))).map(example => example.name), status: 'not-run', owner: pkg.name === 'artplayer-vitepress' ? 'SITE-01' : 'EX-03' })), editor: { source: 'docs/assets/js/common.js', sha256Lf: hash(read('docs/assets/js/common.js')), storage: ['prod', 'ts', 'code', 'log'], isolation: 'Use separate test origin; record keys, do not erase user browser data.', core: { prodTrue: './compiled/artplayer.js', otherwise: './uncompiled/artplayer/index.js' }, pluginSources: 'URL libs parameter; independent of prod toggle', execution: 'Run evaluates editor text; TS mode alone is not strict tsc validation.', runtimeStatus: 'not-run' } }
}
export function validateDemoInventory(inventory, additions = JSON.parse(read('refactor/baselines/demo-additions.json'))) {
  assert.equal(inventory.schemaVersion, 1)
  assert.equal(additions.schemaVersion, 1)
  const taskIds = new Set(JSON.parse(read('refactor/tasks.json')).tasks.map(task => task.id))
  const addedPages = additions.pages ?? []
  assert(Array.isArray(addedPages), 'Invalid added pages')
  for (const page of addedPages) {
    assert(/^docs\/(?:[a-z0-9][a-z0-9._-]*\/)*[a-z0-9][a-z0-9._-]*\.html$/.test(page.source), 'Invalid added HTML path')
    const references = ['introducedBy', 'introducedAfter'].filter(key => Object.hasOwn(page, key))
    assert.equal(references.length, 1, 'Page requires one introduction reference')
    assert(/^[a-f0-9]{40}$/.test(page[references[0]]), 'Missing page introduction commit')
    assert(taskIds.has(page.owner) && page.finalDemoOwner === 'EX-03', 'Missing added page owner')
    assert.equal(page.route, `/${page.source.slice(5)}`.replace(/index\.html$/, ''), 'Added page route does not match its HTML path')
  }
  for (const addition of additions.examples) {
    assert(/^docs\/assets\/example\/[a-z0-9.]+\.js$/.test(addition.source), 'Invalid added example path')
    assert(/^[a-f0-9]{40}$/.test(addition.introducedBy), 'Missing introduction commit')
    assert(taskIds.has(addition.owner) && addition.finalDemoOwner === 'EX-03', 'Missing added example owner')
    assert.equal(new URL(addition.route, 'http://localhost:8082').searchParams.get('example'), path.basename(addition.source, '.js'), 'Added route does not select its example')
  }
  const sources = [...inventory.examples, ...additions.examples].map(item => item.source)
  assert.equal(new Set(sources).size, sources.length, 'Duplicate baseline/addition paths')
  assert.deepEqual(sources.sort(), fs.readdirSync(path.join(root, 'docs/assets/example')).filter(name => name.endsWith('.js')).map(name => `docs/assets/example/${name}`).sort(), 'Demo file coverage drift')
  const pages = [...inventory.pages, ...addedPages].map(item => item.source)
  assert.equal(new Set(pages).size, pages.length, 'Duplicate baseline/addition HTML paths')
  assert.deepEqual(pages.sort(), htmlFiles(), 'HTML route coverage drift')
  assert.deepEqual(inventory.examples.flatMap(item => item.menuLinks).sort(), menuLinks().sort(), 'Editor link coverage drift')
  assert.deepEqual(inventory.packages.map(item => item.name).sort(), JSON.parse(read('refactor/package-inventory.json')).packages.map(item => item.name).sort(), 'Package demo coverage drift')
  const names = new Set(inventory.examples.map(item => item.name))
  for (const pkg of inventory.packages) {
    for (const name of pkg.examples) assert(names.has(name), `Unknown example: ${name}`)
  }
  assert(inventory.examples.find(item => item.name === 'thumbnail').note.includes('absent'), 'Missing historical plugin exception')
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const filename = path.join(refactorDir, 'baselines/demo-inventory.json')
  if (process.argv.includes('--capture')) {
    assert(!fs.existsSync(filename), 'Do not overwrite the historical inventory; reconcile changes explicitly')
    const inventory = captureDemoInventory()
    validateDemoInventory(inventory, { schemaVersion: 1, examples: [] })
    fs.writeFileSync(filename, `${JSON.stringify(inventory, null, 2)}\n`)
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --capture or --check')
    const inventory = JSON.parse(fs.readFileSync(filename, 'utf8'))
    validateDemoInventory(inventory)
    const additions = JSON.parse(read('refactor/baselines/demo-additions.json'))
    console.log(`Demo coverage: ${inventory.examples.length} historical + ${additions.examples.length} added examples, ${inventory.pages.length} historical + ${additions.pages?.length || 0} added HTML paths, ${inventory.packages.length} packages; no browser pass implied`)
  }
}
