import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import cpy from 'cpy'
import prompts from 'prompts'
import { build as viteBuild } from 'vite'
import { getGlobalName, getProjects, getViteBuildConfig } from './utils.js'

const projects = getProjects()
const compiledPath = path.resolve('docs/compiled')

function getBanner(name, version) {
  return `/*!
 * ${name}.js v${version}
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-${new Date().getFullYear()} Harvey Zhao
 * Released under the MIT License.
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
  const entryFile = path.join(projectDir, 'src/index.js')

  if (clean && fs.existsSync(distDir)) {
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
  if (process.argv.includes('all')) {
    for (const name of Object.keys(projects)) {
      await buildProject(name)
    }
    console.log('✅ Finished building all packages!')
  }
  else {
    const { value } = await prompts({
      type: 'select',
      name: 'value',
      message: 'Which project do you want to build?',
      choices: Object.keys(projects).map(name => ({ title: name, value: name })),
    })
    if (value)
      await buildProject(value)
  }
}

runBuild().catch((error) => {
  console.error('❌ Build failed:', error)
  process.exitCode = 1
})
