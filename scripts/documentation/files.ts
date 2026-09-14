import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex')
}
export function read(file: string): string {
  return fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n')
}

export function ownedPath(root: string, relative: string): string {
  assert(
    relative
    && !relative.includes('\\')
    && !path.isAbsolute(relative)
    && !relative.split('/').includes('..'),
    'Invalid documentation path',
  )
  const base = fs.realpathSync(root)
  const file = path.resolve(base, relative)
  let ancestor = file
  while (true) {
    try {
      fs.lstatSync(ancestor)
      break
    }
    catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT'))
        throw error
      const parent = path.dirname(ancestor)
      assert(parent !== ancestor, 'No existing documentation path ancestor')
      ancestor = parent
    }
  }
  const inside = path.relative(base, fs.realpathSync(ancestor))
  assert(
    inside !== '..'
    && !inside.startsWith(`..${path.sep}`)
    && !path.isAbsolute(inside),
    'Documentation path escapes workspace',
  )
  return file
}

export function atomicWrite(file: string, content: string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const temporary = `${file}.${crypto.randomUUID()}.tmp`
  try {
    fs.writeFileSync(temporary, content, { flag: 'wx' })
    fs.renameSync(temporary, file)
  }
  finally {
    if (fs.existsSync(temporary))
      fs.unlinkSync(temporary)
  }
}
