import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const hash = value => createHash('sha256').update(value).digest('hex')
function inside(directory, file) {
  const relative = path.relative(directory, file)
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative)
}

// Keep the original V8 files intact. c8's remap filter expects filesystem paths,
// while Node's source-map cache contains file URLs (including on Windows).
export function normalizeCoverageReports(rawDirectory, mappedDirectory, { root, moduleDirectory, inventory }) {
  assert(!fs.existsSync(mappedDirectory), 'Normalized coverage must use a fresh directory')
  fs.mkdirSync(mappedDirectory)
  const sources = new Map([...inventory.files, ...inventory.excluded].map(item => [path.resolve(root, item.file), item]))
  const reports = []
  let moduleCount = 0
  for (const file of fs.readdirSync(rawDirectory).filter(file => file.endsWith('.json')).sort()) {
    const raw = fs.readFileSync(path.join(rawDirectory, file))
    const report = JSON.parse(raw)
    assert(Array.isArray(report.result), `Invalid V8 report: ${file}`)
    const cache = report['source-map-cache'] || {}
    const modules = report.result.filter(item => item.url.startsWith('file:') && inside(moduleDirectory, fileURLToPath(item.url)))
    for (const module of modules) {
      const map = cache[module.url]?.data
      assert(map?.version === 3 && typeof map.mappings === 'string' && map.mappings.length > 0 && Array.isArray(map.sources) && map.sources.length > 0, `Missing source map: ${module.url}`)
      assert.equal(map.sourcesContent?.length, map.sources.length, `Missing source contents: ${module.url}`)
      for (const [index, source] of map.sources.entries()) {
        const absolute = source.startsWith('file:') ? fileURLToPath(source) : source
        assert(path.isAbsolute(absolute), `Unresolved source map path: ${source}`)
        const enrolled = sources.get(path.normalize(absolute))
        if (enrolled) {
          assert.equal(typeof map.sourcesContent[index], 'string', `Missing mapped source: ${source}`)
          assert.equal(hash(map.sourcesContent[index].replaceAll('\r\n', '\n')), enrolled.sha256, `Stale mapped source: ${source}`)
        }
      }
      moduleCount++
    }
    let normalizedSources = 0
    for (const entry of Object.values(cache)) {
      if (!entry.data?.sources)
        continue
      entry.data.sources = entry.data.sources.map((source) => {
        if (!source.startsWith('file:'))
          return source
        normalizedSources++
        return fileURLToPath(source)
      })
    }
    const normalized = `${JSON.stringify(report)}\n`
    fs.writeFileSync(path.join(mappedDirectory, file), normalized)
    reports.push({ file, rawSha256: hash(raw), normalizedSha256: hash(normalized), modules: modules.length, normalizedSources })
  }
  assert(moduleCount > 0, 'No source-mapped test modules were executed')
  return { modules: moduleCount, reports }
}
