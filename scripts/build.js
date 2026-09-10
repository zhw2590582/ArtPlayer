import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import cpy from 'cpy'
import { build as viteBuild } from 'vite'
import { getEntryFile, selectProjects } from './projects.js'
import { getGlobalName, getProjects, getViteBuildConfig } from './utils.js'

const projects = getProjects()
const compiledPath = path.resolve('docs/compiled')

function getBanner(name, version) {
  const noticeFile = path.join(projects[name], 'THIRD_PARTY_NOTICES')
  const notices = fs.existsSync(noticeFile) ? fs.readFileSync(noticeFile, 'utf8').trim() : ''
  const noticeBlock = notices ? `\n *\n${notices.split(/\r?\n/).map(line => line.trimEnd() ? ` * ${line.trimEnd()}` : ' *').join('\n')}` : ''
  return `/*!
 * ${name}.js v${version}
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-${new Date().getFullYear()} Harvey Zhao
 * Released under the MIT License.${noticeBlock}
 */`
}

const BUILD_FORMATS = {
  main: { format: 'umd', ext: '.js', target: 'es2020', minify: 'terser' },
  legacy: { format: 'umd', ext: '.legacy.js', target: 'es2015', minify: 'terser' },
  esm: { format: 'es', ext: '.mjs', target: 'es2020', minify: false },
}

async function build(name, targetName, clean = false) {
  const projectDir = projects[name]
  const { version } = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf-8'))
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
    banner: getBanner(name, version),
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

  await viteBuild({ root: projectDir, ...config })

  const outFile = path.join(distDir, fileName)
  const size = (fs.statSync(outFile).size / 1024).toFixed(2)
  await cpy(outFile, compiledPath, { flat: true })

  console.log(`✨ Built@${targetName} ${name}@${version} Time@${Date.now() - startTime}ms Size@${size}kb`)
}

async function buildProject(name) {
  await build(name, 'main', true)
  await build(name, 'legacy')
  await build(name, 'esm')
}

async function runBuild() {
  const { names } = await selectProjects(projects, 'build')
  for (const name of names)
    await buildProject(name)
  if (names.length)
    console.log(`✅ Finished building ${names.length} package(s)!`)
}

runBuild().catch((error) => {
  console.error('❌ Build failed:', error)
  process.exitCode = 1
})
