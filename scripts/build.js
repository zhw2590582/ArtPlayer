import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Parcel } from '@parcel/core'
import cpy from 'cpy'
import prompts from 'prompts'
import { getProjects } from './utils.js'

const projects = getProjects()
const compiledPath = path.resolve('docs/compiled')

function compressString(input) {
  return input
    .replace(/\s*(<[^>]+>)\s*/g, '$1')
    .replace(/(\r\n|\n|\r)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function build(name, targetName, clean = false) {
  const projectPackageJson = path.join(projects[name], 'package.json')
  const { version } = JSON.parse(fs.readFileSync(projectPackageJson, 'utf-8'))

  process.chdir(projects[name])

  const distDir = path.join(projects[name], 'dist')

  if (clean && fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true })
    console.log(`🗑️  Cleaned ${distDir}`)
  }

  const targets = {
    main: {
      context: 'browser',
      distDir,
      sourceMap: false,
      outputFormat: 'global',
      isLibrary: true,
      engines: {
        browsers: 'last 1 Chrome version',
      },
    },
    legacy: {
      context: 'browser',
      distDir,
      sourceMap: false,
      outputFormat: 'global',
      isLibrary: true,
      engines: {
        browsers: 'IE 11',
      },
    },
    esm: {
      context: 'browser',
      distDir,
      sourceMap: false,
      outputFormat: 'esmodule',
      isLibrary: true,
      engines: {
        browsers: 'last 1 Chrome version',
      },
    },
  }

  const names = {
    main: `${name}.js`,
    legacy: `${name}.legacy.js`,
    esm: `${name}.mjs`,
  }

  const entryFile = path.join(projects[name], 'src/index.js')

  const bundler = new Parcel({
    entries: entryFile,
    defaultConfig: '@parcel/config-default',
    mode: 'production',
    targets: {
      [targetName]: targets[targetName],
    },
    env: {
      NODE_ENV: 'production',
    },
  })

  const banner = `
/*!
 * ${name}.js v${version}
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-${new Date().getFullYear()} Harvey Zhao
 * Released under the MIT License.
 */
`

  const { bundleGraph, buildTime } = await bundler.run()
  const bundles = bundleGraph.getBundles()

  const filePath = path.join(distDir, 'index.js')
  const newFilePath = path.join(distDir, names[targetName])
  const code = fs.readFileSync(filePath, 'utf-8')

  fs.writeFileSync(filePath, banner + compressString(code))
  fs.renameSync(filePath, newFilePath)
  const size = fs.statSync(newFilePath).size / 1024
  await cpy(newFilePath, compiledPath)

  console.log(
    `✨ Built@${targetName} ${name}@${version}`,
    `Bundles@${bundles.length}`,
    `Time@${buildTime}ms`,
    `Size@${size.toFixed(2)}kb`,
  )
}

async function runBuild() {
  if (process.argv.pop() === 'all') {
    const bundles = Object.keys(projects).map(name => async () => {
      await build(name, 'main', true)
      await build(name, 'legacy')
      await build(name, 'esm')
    })

    await runPromisesInSeries(bundles)
    console.log('✅ Finished building all packages!')
  }
  else {
    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Which project do you want to build?',
      choices: Object.keys(projects).map(name => ({
        title: name,
        value: name,
      })),
      initial: 0,
    })

    if (response.value) {
      await build(response.value, 'main', true)
      await build(response.value, 'legacy')
      await build(response.value, 'esm')
    }
  }
}

function runPromisesInSeries(ps) {
  return ps.reduce((p, next) => p.then(next), Promise.resolve())
}

runBuild().catch((error) => {
  console.error('❌ Build script encountered an error:', error)
})
