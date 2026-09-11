import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import vm from 'node:vm'
import { build as esbuild } from 'esbuild'
import { build as viteBuild } from 'vite'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { getEntryFile } from '../../scripts/projects.js'
import { getGlobalName, getViteBuildConfig } from '../../scripts/utils.js'

export const workspace = fileURLToPath(new URL('../../', import.meta.url))
function coverageDirectory() {
  const output = process.env.ARTPLAYER_COVERAGE_DIR
  if (!output)
    return undefined
  const root = path.resolve(workspace, 'refactor/.cache/coverage')
  const directory = path.resolve(output, String(process.pid))
  assert(directory.startsWith(root + path.sep), 'Coverage modules must stay inside the workspace coverage cache')
  fs.mkdirSync(directory, { recursive: true })
  return directory
}

function importCode(code) {
  const directory = coverageDirectory()
  if (!directory)
    return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
  const filename = path.join(directory, `${hash(code)}.mjs`)
  fs.writeFileSync(filename, code)
  return import(pathToFileURL(filename))
}

export function resolveSource(name, root = workspace) {
  const files = ['.js', '.ts'].map(extension => path.resolve(root, name + extension)).filter(file => fs.existsSync(file))
  assert.equal(files.length, 1, `Expected exactly one JS/TS module: ${name}`)
  return files[0]
}

export async function loadModules(exports, root = workspace) {
  const contents = Object.entries(exports).map(([alias, entry]) => {
    const { file, name = 'default' } = typeof entry === 'string' ? { file: entry } : entry
    assert(/^[\w$]+$/.test(alias) && /^[\w$]+$/.test(name), 'Invalid test export')
    return `export { ${name} as ${alias} } from ${JSON.stringify(resolveSource(file, root))};`
  }).join('\n')
  const directory = coverageDirectory()
  const coverage = directory ? { outfile: path.join(directory, 'modules.mjs'), sourcemap: 'inline', treeShaking: false } : {}
  const { outputFiles } = await esbuild({ stdin: { contents, resolveDir: root }, bundle: true, write: false, platform: 'node', format: 'esm', ...coverage })
  return importCode(outputFiles[0].contents)
}

export async function compilePackage(name, format = 'es', root = workspace) {
  const project = path.join(root, 'packages', name)
  const config = getViteBuildConfig({ entry: getEntryFile(project), name: getGlobalName(name), format, fileName: 'index.js', minify: false })
  config.build.write = false
  const directory = coverageDirectory()
  if (directory) {
    config.build.outDir = directory
    config.build.sourcemap = 'inline'
    config.build.rollupOptions.treeshake = false
  }
  const result = await viteBuild({ root: project, ...config })
  const chunks = (Array.isArray(result) ? result : [result]).flatMap(item => item.output).filter(item => item.type === 'chunk')
  assert.equal(chunks.length, 1, 'Source fixture loader requires one self-contained JS chunk')
  return chunks[0].code
}

export async function loadPackage(name, root = workspace) {
  return importCode(await compilePackage(name, 'es', root))
}

function commonJs(code, globals = {}) {
  const module = { exports: {} }
  vm.runInNewContext(code, { ...globals, module, exports: module.exports }, { timeout: 5000 })
  return module.exports
}

export async function loadPublishedCore(globals = {}) {
  const release = JSON.parse(fs.readFileSync(path.join(workspace, 'refactor/baselines/releases.json'), 'utf8')).releases.find(item => item.name === 'artplayer')
  const archive = await ensureArchive(release)
  const member = 'package/dist/artplayer.js'
  const code = readMember(archive, member)
  assert.equal(hash(code), release.files[member], 'Published core member changed')
  return { name: `published ${release.version}`, Artplayer: commonJs(code.toString('utf8'), globals) }
}

export async function loadCoreArtifact(filename, globals = {}) {
  const absolute = path.resolve(filename)
  const Artplayer = absolute.endsWith('.mjs')
    ? (await import(pathToFileURL(absolute))).default
    : commonJs(fs.readFileSync(absolute, 'utf8'), globals)
  assert.equal(typeof Artplayer?.Emitter, 'function', 'Candidate artifact must expose Artplayer.Emitter')
  return { name: `candidate ${Artplayer.version} (${path.basename(absolute)})`, Artplayer }
}
