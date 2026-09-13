import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { ESLint } from 'eslint'
import { globSync } from 'glob'
import ts from 'typescript'
import compat from 'typescript-compat'
import { generateCoreEditorDeclaration } from './core.ts'
import { vastSdkDeclarations } from './dependencies.ts'
import { generatePluginEditorDeclaration } from './plugin.ts'
import { checkStandaloneDeclarations } from './validation.ts'

export function pluginIdentity(file: string): { name: string, file: string, packageName: string } {
  const packageName = path.basename(path.dirname(path.dirname(file)))
  const names: Record<string, string> = { 'artplayer-tool-iframe': 'ArtplayerToolIframe', 'artplayer-tool-thumbnail': 'ArtplayerToolThumbnail' }
  const name = names[packageName] || packageName.split('-').map((word, index) => index ? word.charAt(0).toUpperCase() + word.slice(1) : word).join('')
  return { name, file: path.basename(file), packageName }
}

export function editorLibUris(code: string, files: string[]): string {
  const source = ts.createSourceFile('common.js', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const lists: ts.ArrayLiteralExpression[] = []
  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'libUris') {
      assert(node.initializer && ts.isArrayLiteralExpression(node.initializer), 'libUris must be an array initializer')
      lists.push(node.initializer)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  assert(lists.length === 1 && lists[0], 'Expected exactly one libUris declaration')
  const list = lists[0]
  const value = `[\n      ${files.map(file => `'./assets/ts/${file}'`).join(',\n      ')},\n    ]`
  return code.slice(0, list.getStart(source)) + value + code.slice(list.end)
}

export async function generateEditorDeclarations(selected: string[] = []): Promise<Map<string, string>> {
  const available = globSync('packages/artplayer-*-*/types/*.d.ts').filter(file => path.basename(file) === `${pluginIdentity(file).packageName}.d.ts`).sort()
  for (const name of selected)
    assert(available.some(file => pluginIdentity(file).packageName === name), `Unknown declaration package: ${name}`)
  assert(new Set(selected).size === selected.length, 'Duplicate declaration package selection')
  const sources = selected.length ? available.filter(file => selected.includes(pluginIdentity(file).packageName)) : available
  const core = generateCoreEditorDeclaration()
  const outputs = new Map<string, string>([['docs/assets/ts/artplayer.d.ts', core]])
  const pluginFiles: string[] = []
  for (const sourceFile of sources) {
    const { name, file, packageName } = pluginIdentity(sourceFile)
    const localTypes: Record<string, string> = packageName === 'artplayer-proxy-mediabunny' ? { './media': fs.readFileSync(path.join(path.dirname(sourceFile), 'media.d.ts'), 'utf8') } : {}
    const dependencies = packageName === 'artplayer-plugin-vast' ? vastSdkDeclarations() : []
    const code = generatePluginEditorDeclaration(fs.readFileSync(sourceFile, 'utf8'), name, localTypes, dependencies)
    outputs.set(path.join('docs/assets/ts', file), code)
    pluginFiles.push(file)
  }
  const languageFile = 'artplayer-i18n.d.ts'
  outputs.set(path.join('docs/assets/ts', languageFile), `declare module 'artplayer/i18n/*' {\n  const language: NonNullable<Artplayer.I18n['en']>\n  export default language\n}\n`)
  const eslint = new ESLint({ fix: true, fixTypes: ['layout'] })
  for (const [file, code] of outputs) {
    const [result] = await eslint.lintText(code, { filePath: file })
    assert(result && !result.errorCount, `Invalid formatted editor declaration ${file}: ${JSON.stringify(result?.messages)}`)
    outputs.set(file, result.output || code)
  }
  // Both actual compilers check the formatted files together, including global collisions.
  const declarations = new Map([...outputs].map(([file, code]) => [path.basename(file), code]))
  for (const compiler of [ts, compat as unknown as typeof ts])
    assert.deepEqual(checkStandaloneDeclarations(declarations, compiler), [], `Invalid editor declarations (TS ${compiler.version})`)
  if (!selected.length) {
    const file = 'docs/assets/js/common.js'
    outputs.set(file, editorLibUris(fs.readFileSync(file, 'utf8'), [...pluginFiles.sort(), 'artplayer.d.ts', languageFile]))
  }
  if (sources.some(file => pluginIdentity(file).packageName === 'artplayer-plugin-vast')) {
    const notices = [['@glomex/vast-ima-player', 'LICENSE'], ['@alugha/ima', 'LICENSE.md']].map(([name, file]) => `${name}\n${fs.readFileSync(path.join('node_modules', name!, file!), 'utf8').replaceAll('\r\n', '\n').trim()}\n`).join('\n')
    outputs.set('docs/assets/ts/artplayer-plugin-vast.LICENSE.txt', notices)
  }
  return outputs
}

export async function runEditorDeclarations(args: string[]): Promise<void> {
  assert(args.every(arg => arg === '--check' || !arg.startsWith('-')), 'Use yarn build:ts [--check] [package ...]')
  const outputs = await generateEditorDeclarations(args.filter(arg => arg !== '--check'))
  for (const [file, code] of outputs) {
    if (args.includes('--check')) {
      assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), code.replaceAll('\r\n', '\n'), `Editor declaration drift: ${file}`)
    }
    else {
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, code)
    }
  }
  console.log(`Editor declarations ${args.includes('--check') ? 'checked' : 'generated'}: ${outputs.size} outputs; all selected declarations checked with current and compatibility compilers`)
}
