import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { gzipSync } from 'node:zlib'

export function createBuildAnalysis() {
  const root = process.cwd()
  const parent = path.join(root, 'refactor/.cache/build-analysis')
  fs.mkdirSync(parent, { recursive: true })
  const directory = fs.mkdtempSync(path.join(parent, 'run-'))
  fs.writeFileSync(path.join(parent, 'latest.json'), `${JSON.stringify({ output: path.relative(root, directory).replaceAll('\\', '/') })}\n`)
  return { root, directory }
}

export function buildAnalysisPlugin({ root, directory }, name, format) {
  return {
    name: 'artplayer-build-analysis',
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle).filter(item => item.type === 'chunk')) {
        const modules = Object.entries(chunk.modules).map(([id, info]) => {
          const normalized = id.replaceAll('\\', '/')
          const dependency = normalized.lastIndexOf('/node_modules/')
          const file = id.startsWith('\0')
            ? `virtual:${id.slice(1)}`
            : dependency === -1 ? path.relative(root, id).replaceAll('\\', '/') : normalized.slice(dependency + 1)
          return { file, renderedBytes: Buffer.byteLength(info.code || ''), renderedCodeUnits: info.renderedLength, originalCodeUnits: info.originalLength, renderedExports: info.renderedExports, removedExports: info.removedExports }
        }).sort((a, b) => b.renderedBytes - a.renderedBytes || a.file.localeCompare(b.file))
        const report = {
          schemaVersion: 1,
          name,
          format,
          node: process.version,
          file: chunk.fileName,
          artifact: { bytes: Buffer.byteLength(chunk.code), gzip9: gzipSync(chunk.code, { level: 9 }).length, sha256: createHash('sha256').update(chunk.code).digest('hex') },
          note: 'Rendered UTF-8 bytes precede final chunk minification; they are not additive compressed sizes or download measurements. Rollup lengths are separately recorded as UTF-16 code units. Original code units describe Rollup input, not raw TypeScript.',
          modules,
        }
        fs.writeFileSync(path.join(directory, `${name}-${format}.json`), `${JSON.stringify(report, null, 2)}\n`)
      }
    },
  }
}
