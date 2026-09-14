import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import path from 'node:path'
import ts from 'typescript'

export interface Module { id: string, body: string, dependencies: Record<string, string> }
export interface Source { id: string, member: string, sourceSha256: string, generatedSha256: string, bodySha256: string, archive?: string }
export interface External { from: string, dependency: string, id: string }
export interface Archive { name: string, version: string, tarball: string, integrity: string, sha256: string }
export const hash = (bytes: string | Uint8Array) => createHash('sha256').update(bytes).digest('hex')

export function verifyArchive(bytes: Uint8Array, archive: Archive) {
  const [algorithm, expected] = archive.integrity.split('-')
  assert(algorithm === 'sha512' && expected, 'Expected SHA-512 archive integrity')
  assert.equal(createHash(algorithm).update(bytes).digest('base64'), expected, `Archive integrity changed: ${archive.name}`)
  assert.equal(hash(bytes), archive.sha256, `Archive bytes changed: ${archive.name}`)
}

export function parcelModules(text: string): Map<string, Module> {
  const source = ts.createSourceFile('console.js', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  let table: ts.ObjectLiteralExpression | undefined
  function visit(node: ts.Node) {
    if (ts.isObjectLiteralExpression(node) && node.properties.some(property => property.name && ts.isStringLiteral(property.name) && property.name.text === 'Focm')) {
      assert(!table, 'Duplicate Parcel module tables')
      table = node
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  assert(table, 'Missing Parcel module table')
  const result = new Map<string, Module>()
  for (const property of table.properties) {
    assert(ts.isPropertyAssignment(property) && ts.isStringLiteral(property.name) && ts.isArrayLiteralExpression(property.initializer))
    const [fn, deps] = property.initializer.elements
    assert(fn && ts.isFunctionExpression(fn) && deps && ts.isObjectLiteralExpression(deps))
    const id = property.name.text
    assert(!result.has(id), `Duplicate Parcel module: ${id}`)
    const dependencies: Record<string, string> = {}
    for (const dep of deps.properties) {
      assert(ts.isPropertyAssignment(dep) && ts.isStringLiteral(dep.name) && ts.isStringLiteral(dep.initializer))
      assert(!(dep.name.text in dependencies), 'Duplicate Parcel dependency')
      dependencies[dep.name.text] = dep.initializer.text
    }
    result.set(id, { id, dependencies, body: text.slice(fn.body.getStart(source) + 1, fn.body.end - 1).trim() })
  }
  return result
}

export function verifyModules<S extends Source>(modules: Map<string, Module>, sources: S[], external: External[], read: (member: string, item: S) => string, compile: (source: string, item: S) => string, options = { roots: ['m6b6'], sourcePrefix: 'package/lib/' }) {
  const mapped = new Map(sources.map(source => [source.id, source]))
  assert.equal(mapped.size, sources.length, 'Duplicate source mapping')
  const visited = new Set<string>()
  const dependencies: External[] = []
  function visit(id: string) {
    if (visited.has(id))
      return
    const item = mapped.get(id)
    const module = modules.get(id)
    assert(item && module, `Missing console-feed module mapping: ${id}`)
    assert(item.member.startsWith(options.sourcePrefix) && item.member.endsWith('.js') && path.posix.normalize(item.member) === item.member, 'Invalid source member')
    visited.add(id)
    const source = read(item.member, item)
    assert.equal(hash(source), item.sourceSha256, `Source changed: ${item.member}`)
    const compiled = compile(source, item)
    assert.equal(hash(compiled), item.generatedSha256, `Compiler output changed: ${id}`)
    assert.equal(hash(module.body), item.bodySha256, `Frozen module changed: ${id}`)
    assert.equal(compiled, module.body, `Rebuilt module differs: ${id}`)
    for (const [dependency, child] of Object.entries(module.dependencies)) {
      assert(modules.has(child), `Unresolved Parcel dependency: ${child}`)
      if (!dependency.startsWith('.')) {
        dependencies.push({ from: id, dependency, id: child })
        continue
      }
      const base = path.posix.join(path.posix.dirname(item.member), dependency)
      const target = mapped.get(child)?.member
      assert(target && [base, `${base}.js`, `${base}/index.js`].includes(target), `Source dependency mapping changed: ${id} ${dependency}`)
      assert.equal(item.archive, mapped.get(child)?.archive, `Relative dependency changed archives: ${id} ${dependency}`)
      visit(child)
    }
  }
  assert(options.roots.length && new Set(options.roots).size === options.roots.length, 'Invalid source roots')
  options.roots.forEach(visit)
  assert.equal(visited.size, sources.length, 'Unreachable source mapping')
  assert.deepEqual(dependencies, external, 'External dependency boundary changed')
  return visited.size
}
