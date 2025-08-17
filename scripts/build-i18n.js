import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Parcel } from '@parcel/core'
import cpy from 'cpy'
import { glob } from 'glob'

const basePath = 'packages/artplayer'
const i18nSrcDir = path.join(basePath, 'src/i18n')
const distDir = path.join(basePath, 'dist/i18n')
const compiledPath = path.resolve('docs/compiled/i18n')

const entries = glob.sync('*.js', {
  cwd: i18nSrcDir,
  ignore: ['index.js', 'zh-cn.js'],
}).map(f => path.join(i18nSrcDir, f));

(async function build() {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true })
  }

  fs.mkdirSync(distDir, { recursive: true })

  const bundler = new Parcel({
    entries,
    defaultConfig: '@parcel/config-default',
    mode: 'production',
    defaultTargetOptions: {
      distDir,
      outputFormat: 'global',
      sourceMaps: false,
      isLibrary: true,
      engines: {
        browsers: ['last 1 Chrome version'],
      },
    },
    env: {
      NODE_ENV: 'production',
    },
  })

  try {
    const { bundleGraph, buildTime } = await bundler.run()
    const bundles = bundleGraph.getBundles()
    console.log(`✨ Built [i18n] ${bundles.length} bundles in ${buildTime}ms`)
    await cpy(distDir, compiledPath)
  }
  catch (err) {
    console.error('❌ Build i18n failed.')
    if (err?.diagnostics) {
      console.error(err.diagnostics)
    }
    else {
      console.error(err)
    }
    process.exitCode = 1
  }
})()
