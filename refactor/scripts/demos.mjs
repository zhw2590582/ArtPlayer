import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hash, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
const read = name => fs.readFileSync(path.join(root, name), 'utf8').replaceAll('\r\n', '\n')
function htmlFiles(dir = 'docs') {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(entry => {
    const name = `${dir}/${entry.name}`
    if (entry.isDirectory()) return ['compiled', 'uncompiled', 'node_modules'].includes(entry.name) ? [] : htmlFiles(name)
    return entry.name.endsWith('.html') ? [name] : []
  }).sort()
}
function menuLinks() {
  return [...read('docs/index.html').matchAll(/href="([^"\n]*[?&]example=[^"\n]*)"/g)].map(match => match[1].replaceAll('&amp;', '&'))
}
export function captureDemoInventory() {
  const links = menuLinks()
  const inventory = JSON.parse(read('refactor/package-inventory.json'))
  const examples = fs.readdirSync(path.join(root, 'docs/assets/example')).filter(name => name.endsWith('.js')).sort().map(file => {
    const name = file.slice(0, -3)
    const source = `docs/assets/example/${file}`
    const linked = links.filter(link => new URL(link, 'http://localhost:8082').searchParams.get('example') === name)
    const libs = [...new Set(linked.flatMap(link => (new URL(link, 'http://localhost:8082').searchParams.get('libs') || '').split('\n').filter(Boolean)))]
    return { name, source, sha256Lf: hash(read(source)), menuLinks: linked, route: linked[0] || `/?example=${name}`, libs,
      status: 'not-run', owner: 'EX-03',
      note: name === 'thumbnail' ? 'References artplayer-plugin-thumbnail, which is absent from the 22 current workspace packages; dependency and route need reconciliation.' : linked.length ? 'Existing menu route; SDK and media loading have not been validated.' : 'No menu link; example route follows common.js loader. Required globals are not automatically loaded.' }
  })
  const pages = htmlFiles().map(source => {
    const text = read(source)
    const uncommented = text.replace(/<!--[\s\S]*?-->/g, '')
    return { source, route: `/${source.slice(5)}`.replace(/index\.html$/, ''), sha256Lf: hash(text),
      kind: source.startsWith('docs/document/') ? 'generated-docs' : source.includes('googlebc') ? 'site-verification' : source === 'docs/upscaler/index.html' ? 'standalone-tool' : 'demo-or-editor',
      scriptSources: [...uncommented.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)].map(match => match[1]),
      status: 'not-run', owner: source.includes('googlebc') ? 'SITE-01' : 'EX-03' }
  })
  return { schemaVersion: 1, task: 'BASE-04', sourceCommit: '94893929', capturedAt: new Date().toISOString(),
    note: 'Historical source inventory, not browser or network evidence. ScriptSources excludes comments but does not resolve inline scripts, import maps or dynamic SDK loading. Hashes use LF and describe this capture; check validates coverage, not current content identity.',
    examples, pages,
    packages: inventory.packages.map(pkg => ({ name: pkg.name, examples: examples.filter(example => example.libs.some(lib => lib.includes(`/${pkg.name}/`))).map(example => example.name), status: 'not-run', owner: pkg.name === 'artplayer-vitepress' ? 'SITE-01' : 'EX-03' })),
    editor: { source: 'docs/assets/js/common.js', sha256Lf: hash(read('docs/assets/js/common.js')), storage: ['prod', 'ts', 'code', 'log'], isolation: 'Use separate test origin; record keys, do not erase user browser data.', core: { prodTrue: './compiled/artplayer.js', otherwise: './uncompiled/artplayer/index.js' }, pluginSources: 'URL libs parameter; independent of prod toggle', execution: 'Run evaluates editor text; TS mode alone is not strict tsc validation.', runtimeStatus: 'not-run' },
  }
}
export function validateDemoInventory(inventory) {
  assert.equal(inventory.schemaVersion, 1)
  assert.deepEqual(inventory.examples.map(item => item.source).sort(), fs.readdirSync(path.join(root, 'docs/assets/example')).filter(name => name.endsWith('.js')).map(name => `docs/assets/example/${name}`).sort(), 'Demo file coverage drift')
  assert.deepEqual(inventory.pages.map(item => item.source).sort(), htmlFiles(), 'HTML route coverage drift')
  assert.deepEqual(inventory.examples.flatMap(item => item.menuLinks).sort(), menuLinks().sort(), 'Editor link coverage drift')
  assert.deepEqual(inventory.packages.map(item => item.name).sort(), JSON.parse(read('refactor/package-inventory.json')).packages.map(item => item.name).sort(), 'Package demo coverage drift')
  const names = new Set(inventory.examples.map(item => item.name))
  for (const pkg of inventory.packages) for (const name of pkg.examples) assert(names.has(name), `Unknown example: ${name}`)
  assert(inventory.examples.find(item => item.name === 'thumbnail').note.includes('absent'), 'Missing historical plugin exception')
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const filename = path.join(refactorDir, 'baselines/demo-inventory.json')
  if (process.argv.includes('--capture')) {
    assert(!fs.existsSync(filename), 'Do not overwrite the historical inventory; reconcile changes explicitly')
    const inventory = captureDemoInventory()
    validateDemoInventory(inventory)
    fs.writeFileSync(filename, `${JSON.stringify(inventory, null, 2)}\n`)
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --capture or --check')
    const inventory = JSON.parse(fs.readFileSync(filename, 'utf8'))
    validateDemoInventory(inventory)
    console.log(`Demo coverage: ${inventory.examples.length} examples, ${inventory.pages.length} HTML paths, ${inventory.packages.length} packages; no browser pass implied`)
  }
}
