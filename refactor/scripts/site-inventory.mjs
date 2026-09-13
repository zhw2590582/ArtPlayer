import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'
import ts from 'typescript'
import { captureDemoInventory } from './demos.mjs'
import { hash, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
const filename = path.join(refactorDir, 'baselines/site-inventory.json')
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replaceAll('\r\n', '\n')
const json = file => JSON.parse(read(file))
const markdown = new MarkdownIt({ html: true })
function files(dir) {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const file = `${dir}/${entry.name}`
    return entry.isDirectory() ? ['node_modules', '.vitepress', 'dist'].includes(entry.name) ? [] : files(file) : [file]
  }).sort()
}
function headings(file) {
  const tokens = markdown.parse(read(file), {})
  return tokens.flatMap((token, index) => token.type === 'heading_open' ? [{ text: tokens[index + 1].content, line: token.map[0] + 1 }] : [])
}
function fingerprint(file) {
  const bytes = fs.readFileSync(path.join(root, file))
  return { file, bytes: bytes.length, sha256: hash(bytes) }
}

export function captureSiteInventory() {
  const demo = captureDemoInventory()
  const historical = json('refactor/baselines/demo-inventory.json')
  const docs = files('packages/artplayer-vitepress/docs').filter(file => file.endsWith('.md')).map((file) => {
    const relative = file.replace('packages/artplayer-vitepress/docs/', '')
    const english = relative.startsWith('en/')
    const peer = `packages/artplayer-vitepress/docs/${english ? relative.slice(3) : `en/${relative}`}`
    return { file, sha256Lf: hash(read(file)), language: english ? 'en' : 'zh', route: `/document/${relative.replace(/index\.md$/, '').replace(/\.md$/, '.html')}`, headings: headings(file), runCodeMarkers: (read(file).match(/className="run-code"/g) || []).length, translation: fs.existsSync(path.join(root, peer)) ? peer : null, translationOwner: fs.existsSync(path.join(root, peer)) ? null : 'SITE-04' }
  })
  const api = files('packages/artplayer/public').filter(file => /\.ts$/.test(file)).flatMap((file) => {
    const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true)
    const rows = []
    function visit(node) {
      if ((ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name) {
        const members = node.members || (ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type) ? node.type.members : [])
        for (const member of members) {
          if (!member.name && !ts.isConstructSignatureDeclaration(member) && !ts.isConstructorDeclaration(member))
            continue
          const name = member.name?.getText(source).replace(/^['"]|['"]$/g, '') || 'constructor'
          const matches = docs.flatMap(doc => doc.headings.filter(heading => heading.text.replaceAll('`', '').split(/[ .()]/).includes(name)).map(heading => ({ file: doc.file, line: heading.line })))
          rows.push({ file, declaration: node.name.text, name, line: source.getLineAndCharacterOfPosition(member.getStart(source)).line + 1, candidateHeadings: matches, semanticReviewOwner: 'SITE-04' })
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    return rows
  })
  const config = read('packages/artplayer-vitepress/docs/.vitepress/config.js')
  const packages = json('refactor/package-inventory.json').packages.map((pkg) => {
    const dir = `packages/${pkg.name}`
    const readme = `${dir}/README.md`
    const architecture = `${dir}/ARCHITECTURE.md`
    const examples = demo.examples.filter(example => example.libs.some(lib => lib.includes(`/${pkg.name}/`))).map(example => example.name)
    return { name: pkg.name, readme: fs.existsSync(path.join(root, readme)) ? readme : null, architecture: fs.existsSync(path.join(root, architecture)) ? architecture : null, examples, sidebarMentionsPackage: config.includes(pkg.name), dedicatedPages: pkg.name === 'artplayer' || pkg.name === 'artplayer-vitepress' ? docs.map(doc => doc.file) : docs.filter(doc => doc.file.endsWith(`/plugin/${pkg.name.replace('artplayer-plugin-', '')}.md`)).map(doc => doc.file), contentReviewOwner: 'SITE-04', demoExecutionOwner: 'EX-03' }
  })
  const scriptFiles = ['scripts/build-types.mjs', 'scripts/build-ts.js', 'scripts/editor-types.mjs', 'scripts/plugin-editor-types.mjs', 'scripts/build-test.js', 'scripts/build-i18n.js', 'scripts/build-docs.js', 'scripts/build-llm.js', 'scripts/trans-docs.js', 'scripts/projects.js', 'docs/assets/js/common.js', 'docs/assets/js/mobile.js', 'packages/artplayer-vitepress/docs/public/main.js', 'packages/artplayer-vitepress/docs/vite.config.ts', 'packages/artplayer-vitepress/docs/.vitepress/config.js']
  const assets = [...files('docs/assets/sample'), ...files('docs/assets/jassub').filter(file => /\.(?:ttf|otf|woff2?)$/i.test(file)), ...files('docs/assets/js/vs'), 'docs/assets/js/vconsole.min.js', 'docs/assets/js/console.js'].map(fingerprint)
  return {
    schemaVersion: 1,
    task: 'SITE-01',
    note: 'Read-only source inventory. Heading matches are candidates, never semantic API coverage. Asset identity is not permission. No runtime, remote Pages or npm acceptance is implied.',
    counts: { packages: packages.length, markdown: docs.length, examples: demo.examples.length, html: demo.pages.length, declarationMembers: api.length, assets: assets.length },
    docs,
    api,
    packages,
    examples: demo.examples,
    pages: demo.pages,
    baselinePaths: { examplesAdded: demo.examples.filter(row => !historical.examples.some(old => old.source === row.source)).map(row => row.source), examplesRemoved: historical.examples.filter(row => !demo.examples.some(now => now.source === row.source)).map(row => row.source), htmlAdded: demo.pages.filter(row => !historical.pages.some(old => old.source === row.source)).map(row => row.source), htmlRemoved: historical.pages.filter(row => !demo.pages.some(now => now.source === row.source)).map(row => row.source) },
    editorDeclarations: [...read('docs/assets/js/common.js').matchAll(/'\.\/assets\/ts\/([^']+\.d\.ts)'/g)].map(match => ({ file: `docs/assets/ts/${match[1]}`, exists: fs.existsSync(path.join(root, 'docs/assets/ts', match[1])), owner: 'SITE-02' })),
    scripts: [...scriptFiles, ...files('scripts/docs-smoke').filter(file => file.endsWith('.ts')), ...files('scripts/editor-declarations').filter(file => file.endsWith('.ts'))].map(file => ({ file, sha256Lf: hash(read(file)) })),
    generationCommands: Object.fromEntries(Object.entries(json('package.json').scripts).filter(([name]) => /^(?:build:(?:types|ts|test|i18n|docs|llm|all)|ci:build)$/.test(name))),
    siteManifest: json('packages/artplayer-vitepress/package.json'),
    assets,
  }
}

export function validateSiteInventory(value) {
  assert.equal(value.schemaVersion, 1)
  const tasks = new Map(json('refactor/tasks.json').tasks.map(task => [task.id, task]))
  for (const owner of ['SITE-02', 'SITE-03', 'SITE-04', 'SITE-05', 'EX-03', 'REL-01']) assert(tasks.has(owner), `Missing follow-up: ${owner}`)
  for (const item of value.editorDeclarations) assert(item.exists, `Missing editor declaration: ${item.file}`)
  assert.equal(new Set(value.packages.map(pkg => pkg.name)).size, 22)
  for (const file of ['docs/index.html', 'docs/mobile.html', 'docs/esm.html', 'docs/i18n.html', 'docs/iframe.html', 'docs/test/index.html']) assert(value.pages.some(page => page.source === file), `Missing HTML entry: ${file}`)
  assert.deepEqual(value, captureSiteInventory(), 'Site inventory drift; inspect changes before --write')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.argv.length, 3, 'Use --write or --check')
  assert(['--write', '--check'].includes(process.argv[2]), 'Use --write or --check')
  const value = process.argv[2] === '--write' ? captureSiteInventory() : JSON.parse(fs.readFileSync(filename, 'utf8'))
  validateSiteInventory(value)
  if (process.argv[2] === '--write')
    fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`)
  console.log(`Site inventory: ${JSON.stringify(value.counts)}; semantic/browser review remains separate`)
}
