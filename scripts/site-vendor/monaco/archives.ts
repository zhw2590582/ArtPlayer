import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export interface Archive { name: string, version: string, tarball: string, integrity: string, sha256: string }
export interface Member { archive: string, member: string, sha256: string }
export interface Remote { source: string, sha256: string, gitBlobSha: string, apiUrl: string }
export const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')

async function download(url: string): Promise<Buffer> {
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) })
  assert(response.ok, `${url}: HTTP ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}

// Historical inputs stay in an isolated cache; never install their package scripts.
export class ArchiveCache {
  readonly root: string
  readonly directory: string

  constructor(root: string, directory: string) {
    this.root = root
    this.directory = directory
    fs.mkdirSync(directory, { recursive: true })
    assert.equal(fs.realpathSync(directory).toLowerCase(), path.resolve(directory).toLowerCase(), 'Redirected Monaco cache')
  }

  async verify(archives: Archive[], remotes: Remote[], fetch: boolean): Promise<void> {
    for (const archive of archives) {
      const file = path.join(this.directory, `${archive.name}-${archive.version}.tgz`)
      const bytes = fetch ? await download(archive.tarball) : fs.readFileSync(file)
      assert.equal(hash(bytes), archive.sha256, `Monaco archive changed: ${archive.name}`)
      assert.equal(`sha512-${createHash('sha512').update(bytes).digest('base64')}`, archive.integrity, 'Monaco archive integrity changed')
      if (fetch)
        fs.writeFileSync(file, bytes)
    }
    for (const remote of remotes) {
      const verify = (bytes: Buffer) => {
        assert.equal(hash(bytes), remote.sha256, 'Monaco fixed Git content changed')
        assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), remote.gitBlobSha, 'Monaco Git blob changed')
      }
      verify(fs.readFileSync(path.join(this.root, remote.source)))
      if (fetch) {
        const data: { encoding: string, content: string } = JSON.parse((await download(remote.apiUrl)).toString('utf8'))
        assert.equal(data.encoding, 'base64', 'Expected Git content encoding')
        verify(Buffer.from(data.content, 'base64'))
      }
    }
  }

  read(archive: string, member: string): Buffer {
    return execFileSync('tar', ['-xOzf', path.join(this.directory, `${archive}.tgz`), member], { maxBuffer: 20 * 1024 * 1024 })
  }

  member(member: Member): Buffer {
    const bytes = this.read(member.archive, member.member)
    assert.equal(hash(bytes), member.sha256, `Monaco source member changed: ${member.member}`)
    return bytes
  }

  extractCompiler(archive: Archive): void {
    const name = `${archive.name}-${archive.version}`
    const members = execFileSync('tar', ['-tzf', path.join(this.directory, `${name}.tgz`)], { encoding: 'utf8' }).trim().split(/\r?\n/)
    const directory = path.join(this.directory, 'compiler/node_modules', archive.name)
    fs.mkdirSync(directory, { recursive: true })
    assert.equal(fs.realpathSync(directory).toLowerCase(), path.resolve(directory).toLowerCase(), 'Redirected compiler directory')
    for (const member of members.filter(member => !member.endsWith('/'))) {
      assert(member.startsWith('package/') && !member.includes('\\') && !member.split('/').includes('..'), 'Unsafe compiler archive member')
      const destination = path.resolve(directory, member.slice('package/'.length))
      assert(destination.startsWith(`${directory}${path.sep}`), 'Compiler member escapes cache')
      fs.mkdirSync(path.dirname(destination), { recursive: true })
      assert.equal(fs.realpathSync(path.dirname(destination)).toLowerCase(), path.dirname(destination).toLowerCase(), 'Redirected compiler member directory')
      assert(!fs.existsSync(destination) || !fs.lstatSync(destination).isSymbolicLink(), 'Redirected compiler file')
      fs.writeFileSync(destination, this.read(name, member))
    }
  }
}
