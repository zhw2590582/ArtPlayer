import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import cpy from 'cpy'
import { glob } from 'glob'
import { build as viteBuild } from 'vite'
import { getViteBuildConfig, toPascalCase } from './utils.js'

const basePath = 'packages/artplayer'
const i18nSrcDir = path.join(basePath, 'src/i18n')
const distDir = path.join(basePath, 'dist/i18n')
const compiledPath = path.resolve('docs/compiled/i18n')

const entries = glob.sync('*.js', {
  cwd: i18nSrcDir,
  ignore: ['index.js', 'zh-cn.js'],
}).map(f => path.join(i18nSrcDir, f))

async function buildI18n() {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true })
  }
  fs.mkdirSync(distDir, { recursive: true })

  for (const entry of entries) {
    const baseName = path.basename(entry, '.js')
    const globalName = `artplayerI18n${toPascalCase(baseName)}`

    // Build UMD and ESM formats
    for (const [format, ext] of [['umd', '.js'], ['es', '.mjs']]) {
      const config = getViteBuildConfig({
        entry,
        outDir: distDir,
        name: globalName,
        format,
        fileName: `${baseName}${ext}`,
      })
      await viteBuild(config)
    }

    console.log(`✅ Built i18n: ${baseName}`)
  }

  await cpy(path.join(distDir, '*'), compiledPath, { flat: true })
  console.log('✨ Finished building i18n')
}

buildI18n().catch((err) => {
  console.error('❌ Build i18n failed:', err)
  process.exitCode = 1
})
