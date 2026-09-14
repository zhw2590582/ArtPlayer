import fs from 'node:fs'
import path from 'node:path'
import cpy from 'cpy'
import { build as viteBuild } from 'vite'
import { buildAnalysisPlugin, createBuildAnalysis } from './analysis.ts'
import { getBanner } from './banner.ts'
import { getViteBuildConfig } from './config.ts'
import { getGlobalName } from './names.ts'
import { getEntryFile, getProjects, selectProjects } from './projects.ts'

const BUILD_FORMATS = {
  main: { format: 'umd', ext: '.js', target: 'es2020', minify: 'terser' },
  legacy: { format: 'umd', ext: '.legacy.js', target: 'es2015', minify: 'terser' },
  esm: { format: 'es', ext: '.mjs', target: 'es2020', minify: false },
} as const

async function build(projectDir: string, compiledPath: string, name: string, targetName: keyof typeof BUILD_FORMATS, clean = false, analysis?: ReturnType<typeof createBuildAnalysis>) {
  const manifest: unknown = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf-8'))
  if (!manifest || typeof manifest !== 'object' || !('version' in manifest) || typeof manifest.version !== 'string')
    throw new Error(`Missing package version: ${name}`)
  const { version } = manifest
  const distDir = path.join(projectDir, 'dist')
  const entryFile = getEntryFile(projectDir)

  if (clean && fs.existsSync(distDir)) {
    if (fs.realpathSync(distDir) !== path.join(fs.realpathSync(projectDir), 'dist'))
      throw new Error(`Refusing to clean redirected dist directory: ${distDir}`)
    fs.rmSync(distDir, { recursive: true, force: true })
  }

  const startTime = Date.now()
  const { format, ext, target, minify } = BUILD_FORMATS[targetName]
  const fileName = `${name}${ext}`

  const config = getViteBuildConfig({
    entry: entryFile,
    outDir: distDir,
    name: getGlobalName(name),
    format,
    fileName,
    minify,
    target,
    banner: getBanner(projectDir, name, version),
  })

  // Terser options for all builds (preserve banner comments starting with /*!)
  const isLegacy = targetName === 'legacy'
  config.build.terserOptions = {
    ecma: isLegacy ? 5 : 2020,
    compress: { ecma: isLegacy ? 5 : 2020, comparisons: false, inline: 2 },
    mangle: { safari10: true },
    format: {
      ecma: isLegacy ? 5 : 2020,
      comments: /^!/,
      ascii_only: true,
      max_line_len: false, // No line length limit
    },
  }
  if (analysis)
    config.build.rollupOptions.plugins.push(buildAnalysisPlugin(analysis, name, targetName))

  await viteBuild({ root: projectDir, ...config })

  const outFile = path.join(distDir, fileName)
  const size = (fs.statSync(outFile).size / 1024).toFixed(2)
  await cpy(outFile, compiledPath, { flat: true })

  console.log(`✨ Built@${targetName} ${name}@${version} Time@${Date.now() - startTime}ms Size@${size}kb`)
}

async function buildProject(projectDir: string, compiledPath: string, name: string, analysis?: ReturnType<typeof createBuildAnalysis>) {
  await build(projectDir, compiledPath, name, 'main', true, analysis)
  await build(projectDir, compiledPath, name, 'legacy', false, analysis)
  await build(projectDir, compiledPath, name, 'esm', false, analysis)
}

export async function runBuild(): Promise<void> {
  const projects = getProjects()
  const compiledPath = path.resolve('docs/compiled')
  const { names, analyze } = await selectProjects(projects, 'build')
  const analysis = analyze ? createBuildAnalysis() : undefined
  for (const name of names)
    await buildProject(projects[name]!, compiledPath, name, analysis)
  if (analysis)
    console.log(`Build analysis: ${analysis.directory}`)
  if (names.length)
    console.log(`✅ Finished building ${names.length} package(s)!`)
}
