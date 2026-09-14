import type { PagesContract } from './artifact.ts'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { build } from 'vite'
import { getViteBuildConfig } from '../library/config.ts'
import { getGlobalName } from '../library/names.ts'
import { getEntryFile, getProjects } from '../library/projects.ts'
import { compareCompiled, digest, inside, inventory, validateArtifact } from './artifact.ts'

export async function preparePages(root: string) {
  const contract: PagesContract = JSON.parse(fs.readFileSync(path.join(root, 'scripts/pages/contract.json'), 'utf8'))
  const projects = getProjects(root)
  const names = Object.keys(projects).sort()
  const docs = path.join(root, 'docs')
  // Validate before copying, so redirected input paths cannot be followed by cp.
  inventory(docs)
  const compiled = compareCompiled(root, docs, names)
  const cache = path.join(root, 'refactor/.cache/pages')
  fs.mkdirSync(cache, { recursive: true })
  const output = fs.mkdtempSync(path.join(cache, 'run-'))
  const site = inside(output, 'site')
  fs.cpSync(docs, site, { recursive: true })
  const inputs = Object.fromEntries(names.map(name => [name, { manifest: digest(path.join(projects[name]!, 'package.json')), source: inventory(path.join(projects[name]!, 'src')) }]))
  const report = { source: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), inputs, buildInputs: { library: inventory(path.join(root, 'scripts/library')), pages: inventory(path.join(root, 'scripts/pages')), lock: digest(path.join(root, 'yarn.lock')) }, output, compiled, contract: digest(path.join(root, 'scripts/pages/contract.json')), aliases: [] as string[], status: 'building', error: '', files: {} as ReturnType<typeof inventory> }
  try {
    for (const name of names) {
      // Preserve old demo URLs with fresh builds using the same configuration as yarn dev.
      const outDir = inside(site, `uncompiled/${name}`)
      await build({ root: projects[name], ...getViteBuildConfig({ entry: getEntryFile(projects[name]!), outDir, name: getGlobalName(name), format: 'iife', fileName: 'index.js', minify: false, emptyOutDir: true }) })
      report.aliases.push(`uncompiled/${name}/index.js`)
    }
    report.files = validateArtifact(site, { ...contract, requiredPaths: [...contract.requiredPaths, ...report.aliases] })
    report.status = 'validated'
    fs.writeFileSync(path.join(cache, 'latest.json'), `${JSON.stringify({ output }, null, 2)}\n`)
    return { output, site, report }
  }
  catch (error) {
    report.status = 'failed'
    report.error = String(error)
    throw error
  }
  finally {
    fs.writeFileSync(path.join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  }
}
