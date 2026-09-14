import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export interface PagesContract { domain: string, requiredPaths: string[] }
export interface FileIdentity { bytes: number, sha256: string }

export function digest(file: string): FileIdentity {
  const bytes = fs.readFileSync(file)
  return { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }
}

export function inside(root: string, relative: string): string {
  assert(relative && !relative.includes('\\') && !path.isAbsolute(relative), `Invalid artifact path: ${relative}`)
  const result = path.resolve(root, relative)
  const actual = path.relative(path.resolve(root), result)
  assert(actual && actual !== '..' && !actual.startsWith(`..${path.sep}`) && !path.isAbsolute(actual), `Artifact path escaped root: ${relative}`)
  return result
}

export function inventory(root: string): Record<string, FileIdentity> {
  assert(fs.lstatSync(root).isDirectory() && !fs.lstatSync(root).isSymbolicLink(), 'Artifact root must be a real directory')
  const files: Record<string, FileIdentity> = {}
  function walk(directory: string) {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name)
      const stat = fs.lstatSync(file)
      assert(!stat.isSymbolicLink(), `Pages cannot contain symbolic links: ${file}`)
      if (stat.isDirectory()) {
        walk(file)
      }
      else {
        assert(stat.isFile() && stat.nlink === 1, `Pages requires ordinary files without hard links: ${file}`)
        const relative = path.relative(root, file).split(path.sep).join('/')
        files[relative] = digest(file)
      }
    }
  }
  walk(root)
  assert(Object.values(files).reduce((total, file) => total + file.bytes, 0) < 10_000_000_000, 'Pages artifact exceeds the 10GB archive ceiling')
  return files
}

export function validateArtifact(root: string, contract: PagesContract) {
  const files = inventory(root)
  for (const relative of contract.requiredPaths) {
    inside(root, relative)
    assert(Object.hasOwn(files, relative), `Missing required Pages route: ${relative}`)
    assert(relative === '.nojekyll' || files[relative]!.bytes > 0, `Empty Pages route: ${relative}`)
  }
  assert.equal(fs.readFileSync(inside(root, 'CNAME'), 'utf8').trim(), contract.domain, 'Pages domain changed')
  return files
}

export function compareCompiled(root: string, site: string, names: string[]) {
  const checked: string[] = []
  for (const name of names) {
    for (const suffix of ['.js', '.legacy.js', '.mjs']) {
      const relative = `${name}${suffix}`
      const source = inside(root, `packages/${name}/dist/${relative}`)
      const target = inside(site, `compiled/${relative}`)
      assert.equal(digest(target).sha256, digest(source).sha256, `Stale compiled Pages artifact: ${relative}`)
      checked.push(relative)
    }
  }
  return checked
}
