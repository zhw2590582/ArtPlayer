import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { Parser } from 'htmlparser2'

export interface LinkIssue {
  source: string
  href: string
  reason: string
}

async function files(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const result: string[] = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    assert(!entry.isSymbolicLink(), `Unexpected symlink: ${entry.name}`)
    const file = path.join(directory, entry.name)
    if (entry.isDirectory())
      result.push(...await files(file))
    else result.push(file)
  }
  return result
}

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function readHtml(source: string) {
  const anchors = new Set<string>()
  const references: string[] = []
  let templateDepth = 0
  new Parser({
    onopentag(name, attributes) {
      const inert = templateDepth > 0
      if (name === 'template')
        templateDepth++
      if (inert)
        return
      assert(name !== 'base' || !attributes.href, 'An HTML base URL requires explicit link-checker support')
      if (attributes.id)
        anchors.add(attributes.id)
      if (name === 'a' && attributes.name)
        anchors.add(attributes.name)
      for (const attribute of ['href', 'src']) {
        if (attributes[attribute])
          references.push(attributes[attribute])
      }
    },
    onclosetag(name) {
      if (name === 'template')
        templateDepth--
    },
  }).end(source)
  return { anchors, references }
}

// Check the shipped index, not a separately regenerated approximation of its links.
export async function readSearchLinks(documentRoot: string) {
  const chunks = path.join(documentRoot, 'assets/chunks')
  const matches = (await fs.readdir(chunks)).filter(name => /^virtual_search-data\.[\w-]+\.js$/.test(name))
  assert.equal(matches.length, 1, 'Expected exactly one built search data module')
  const name = matches[0]
  assert(name)
  const file = path.join(chunks, name)
  const sha256 = createHash('sha256').update(await fs.readFile(file)).digest('hex')
  const module: unknown = await import(`${pathToFileURL(file).href}?sha256=${sha256}`)
  assert(record(module) && record(module.default) && record(module.default.PREVIEW_LOOKUP), 'Invalid built search lookup')
  const links = Object.entries(module.default.PREVIEW_LOOKUP).map(([id, value]) => {
    assert(record(value) && typeof value.l === 'string' && value.l.length, `Missing search URL: ${id}`)
    return { id, href: value.l }
  })
  assert(links.length > 0, 'Empty search lookup')
  return { file, sha256, links }
}

export async function checkSiteLinks(siteRoot: string) {
  const root = await fs.realpath(siteRoot)
  const documentRoot = path.join(root, 'document')
  const htmlFiles = (await files(documentRoot)).filter(file => file.endsWith('.html'))
  assert(htmlFiles.length > 0, 'No generated documentation pages')
  const search = await readSearchLinks(documentRoot)
  const documents = new Map<string, ReturnType<typeof readHtml>>()
  const external = new Set<string>()
  const issues: LinkIssue[] = []
  let localReferences = 0

  async function document(file: string) {
    let value = documents.get(file)
    if (!value) {
      value = readHtml(await fs.readFile(file, 'utf8'))
      documents.set(file, value)
    }
    return value
  }

  async function check(href: string, source: string, base = source) {
    try {
      const url = new URL(href, new URL(base, 'https://artplayer.org'))
      if (!['http:', 'https:'].includes(url.protocol))
        return
      if (url.hostname !== 'artplayer.org') {
        external.add(url.href)
        return
      }
      localReferences++
      let file = path.resolve(root, `.${decodeURIComponent(url.pathname)}`)
      assert(file === root || file.startsWith(`${root}${path.sep}`), 'Target outside site root')
      let stat
      try {
        stat = await fs.stat(file)
      }
      catch {
        throw new Error('Missing local file')
      }
      if (stat.isDirectory()) {
        file = path.join(file, 'index.html')
        assert((await fs.stat(file)).isFile(), 'Missing directory index')
      }
      assert((await fs.realpath(file)).startsWith(`${root}${path.sep}`), 'Target resolves outside site root')
      if (url.hash && file.endsWith('.html')) {
        const id = decodeURIComponent(url.hash.slice(1))
        const target = await document(file)
        if (id && id.toLowerCase() !== 'top') {
          assert(target.anchors.has(id), `Missing anchor: ${id}`)
        }
      }
    }
    catch (error) {
      issues.push({ source, href, reason: error instanceof Error ? error.message : String(error) })
    }
  }

  for (const file of htmlFiles) {
    const source = `/${path.relative(root, file).replaceAll('\\', '/')}`
    const html = await document(file)
    for (const href of html.references)
      await check(href, source)
  }
  const pageIssues = issues.length
  for (const link of search.links)
    await check(link.href, `search:${link.id}`, '/document/')

  return {
    pages: htmlFiles.length,
    localReferences,
    searchEntries: search.links.length,
    searchModule: { path: path.relative(root, search.file).replaceAll('\\', '/'), sha256: search.sha256 },
    externalUrls: [...external].sort(),
    pageIssues,
    searchIssues: issues.length - pageIssues,
    issues,
  }
}
