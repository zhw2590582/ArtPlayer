import type { Buffer } from 'node:buffer'
import assert from 'node:assert/strict'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

export function coreStyleOrder(source: string): string[] {
  const ast = ts.createSourceFile('core.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const tables = new Map<string, string[]>()
  const visitTables = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isArrayLiteralExpression(node.initializer)
      && node.initializer.elements.every(item => ts.isStringLiteral(item))) { tables.set(node.name.text, node.initializer.elements.map(item => (item as ts.StringLiteral).text)) }
    ts.forEachChild(node, visitTables)
  }
  visitTables(ast)
  const styles: string[] = []
  const visitCalls = (node: ts.Node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'define') {
      const name = node.arguments[0]
      if (name && ts.isElementAccessExpression(name) && ts.isIdentifier(name.expression) && ts.isNumericLiteral(name.argumentExpression)) {
        const id = tables.get(name.expression.text)?.[Number(name.argumentExpression.text)]
        if (id?.startsWith('vs/css!') && id !== 'vs/css!vs/editor/editor.main')
          styles.push(id.slice('vs/css!'.length))
      }
    }
    ts.forEachChild(node, visitCalls)
  }
  visitCalls(ast)
  assert(styles.length && new Set(styles).size === styles.length, 'Missing or repeated core CSS modules')
  return styles
}

interface PreparedStyle { id: string, contents: string, moduleName: string, fsPath: string }
interface CssPlugin {
  writeFile: (plugin: string, entry: string, request: { toUrl: (name: string) => string }, write: (file: string, source: string) => void, config: object) => void
}

// Execute only the pinned transport function and CSS plugin, with reads restricted
// to the caller's verified source map. VM is an isolation aid, not a security sandbox.
export function prepareCoreStyles(transportRecipe: string, cssRecipe: string, ids: string[], read: (file: string) => Buffer) {
  const ast = ts.createSourceFile('standalone.ts', transportRecipe, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const functions = ast.statements.filter(node => ts.isFunctionDeclaration(node) && node.name?.text === 'transportCSS')
  assert.equal(functions.length, 1, 'Expected one transportCSS function')
  const code = ts.transpileModule(functions[0]!.getText(ast), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } }).outputText
  const assets = new Set<string>()
  const context = vm.createContext({
    SRC_DIR: '/source',
    path: path.posix,
    fs: { readFileSync: (file: string) => {
      assert(file.startsWith('/source/') && !file.split('/').includes('..'), 'CSS source escaped verified inputs')
      const source = `src/${file.slice('/source/'.length)}`
      assets.add(source)
      return read(source)
    } },
  })
  vm.runInContext(code, context, { timeout: 1000 })
  const transport = context.transportCSS as (module: string, enqueue: (font: string) => void, write: (file: string, contents: string) => void) => boolean
  const fonts = new Set<string>()
  const prepared: PreparedStyle[] = ids.map((id) => {
    assert(/^vs\/[\w./-]+$/.test(id) && !id.split('/').includes('..'), 'Invalid CSS module')
    let contents: string | undefined
    assert(transport(`${id}.css`, font => fonts.add(font), (file, source) => {
      assert.equal(file, `${id}.css`)
      assert.equal(contents, undefined, 'Repeated CSS output')
      contents = source
    }), 'CSS transport rejected input')
    assert(typeof contents === 'string', 'Missing transported CSS')
    return { id, contents, moduleName: id, fsPath: `/source/${id}.css` }
  })
  let plugin: CssPlugin | undefined
  const build = vm.createContext({
    process: { versions: { node: '24' } },
    require: { nodeRequire: (name: string) => {
      if (name === 'path')
        return path.posix
      assert.equal(name, 'fs', 'Unexpected CSS build import')
      return {
        readFileSync: () => { throw new Error('Unprepared CSS resource') },
      }
    } },
    define: (name: string, value: CssPlugin) => {
      assert.equal(name, 'vs/css')
      assert.equal(plugin, undefined)
      plugin = value
    },
    inlineResources: true,
    inlineResourcesLimit: 5000,
    cssPluginEntryPoints: { 'vs/editor/editor.main': prepared },
  })
  vm.runInContext(cssRecipe, build, { timeout: 1000 })
  assert(plugin, 'Missing CSS build plugin')
  let joined: string | undefined
  plugin.writeFile('vs/css', 'vs/editor/editor.main', { toUrl: name => name }, (file, source) => {
    assert.equal(file, 'vs/editor/editor.main.css')
    assert.equal(joined, undefined)
    joined = source
  }, {})
  assert(typeof joined === 'string', 'Missing CSS bundle')
  return { prepared, assets: [...assets], fonts: [...fonts], joined, normalizedSeparators: (joined.match(/\r\n/g) || []).length }
}

export function coreCssHeader(commit: string): string {
  assert(/^[a-f0-9]{40}$/.test(commit))
  return `/*!-----------------------------------------------------------\n * Copyright (c) Microsoft Corporation. All rights reserved.\n * Version: 0.30.1(${commit})\n * Released under the MIT license\n * https://github.com/microsoft/vscode/blob/main/LICENSE.txt\n *-----------------------------------------------------------*/\n`
}
