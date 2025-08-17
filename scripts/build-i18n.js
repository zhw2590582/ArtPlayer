import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Parcel } from '@parcel/core'
import { glob } from 'glob'

const basePath = 'packages/artplayer'
const i18nSrcDir = path.join(basePath, 'src/i18n')
const distDir = path.join(basePath, 'dist/i18n')

const entries = glob.sync('*.js', {
  cwd: i18nSrcDir,
  ignore: ['index.js', 'zh-cn.js'],
}).map(f => path.join(i18nSrcDir, f))

async function buildI18n() {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true })
  }
  fs.mkdirSync(distDir, { recursive: true })

  // --- 1. 构建 global(.js) 到临时目录 ---
  const distJs = path.join(distDir, 'cjs')
  const bundlerJs = new Parcel({
    entries,
    defaultConfig: '@parcel/config-default',
    mode: 'production',
    defaultTargetOptions: {
      distDir: distJs,
      outputFormat: 'global',
      sourceMaps: false,
      isLibrary: true,
      engines: { browsers: ['last 1 Chrome version'] },
    },
    env: { NODE_ENV: 'production' },
  })
  await bundlerJs.run()
  console.log('✅ Built i18n global (.js)')

  // --- 2. 构建 esmodule(.mjs) 到临时目录 ---
  const distMjs = path.join(distDir, 'esm')
  const bundlerMjs = new Parcel({
    entries,
    defaultConfig: '@parcel/config-default',
    mode: 'production',
    defaultTargetOptions: {
      distDir: distMjs,
      outputFormat: 'esmodule',
      sourceMaps: false,
      isLibrary: true,
      engines: { browsers: ['last 1 Chrome version'] },
    },
    env: { NODE_ENV: 'production' },
  })
  const { bundleGraph } = await bundlerMjs.run()
  const bundles = bundleGraph.getBundles()
  for (const bundle of bundles) {
    if (bundle.type === 'js') {
      const oldPath = bundle.filePath
      const newPath = oldPath.replace(/\.js$/, '.mjs')
      fs.renameSync(oldPath, newPath)
    }
  }
  console.log('✅ Built i18n esm (.mjs)')

  // --- 3. 合并两个目录到 dist/i18n ---
  for (const f of fs.readdirSync(distJs)) {
    fs.renameSync(path.join(distJs, f), path.join(distDir, f))
  }
  for (const f of fs.readdirSync(distMjs)) {
    fs.renameSync(path.join(distMjs, f), path.join(distDir, f))
  }
  fs.rmSync(distJs, { recursive: true, force: true })
  fs.rmSync(distMjs, { recursive: true, force: true })

  console.log('✨ Finished building i18n with both .js and .mjs')
}

buildI18n().catch((err) => {
  console.error('❌ Build i18n failed', err)
  process.exitCode = 1
})
