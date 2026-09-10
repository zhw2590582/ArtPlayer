import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import servor from 'servor'
import openBrowser from 'servor/utils/openBrowser.js'
import { build as viteBuild } from 'vite'
import { getEntryFile, selectProjects } from './projects.js'
import { createRebuildQueue } from './rebuild.js'
import { getGlobalName, getProjects, getViteBuildConfig } from './utils.js'

const projects = getProjects()

async function develop(name, open) {
  const projectPath = projects[name]
  const uncompiledPath = path.resolve(`docs/uncompiled/${name}`)
  let browserOpened = false

  const { url } = await servor({
    root: 'docs',
    fallback: 'index.html',
    reload: true,
    port: 8082,
  })

  fs.mkdirSync(uncompiledPath, { recursive: true })

  async function buildBundle() {
    const startTime = Date.now()
    try {
      const config = getViteBuildConfig({
        entry: getEntryFile(projectPath),
        outDir: uncompiledPath,
        name: getGlobalName(name),
        format: 'iife',
        fileName: 'index.js',
        minify: false,
        emptyOutDir: true,
      })
      config.define['process.env.NODE_ENV'] = JSON.stringify('development')

      await viteBuild({ root: projectPath, ...config })
      console.log(`[${name}] ✅ Built in ${Date.now() - startTime}ms`)

      if (open && !browserOpened) {
        browserOpened = true
        openBrowser(url)
      }
    }
    catch (error) {
      console.error(`[${name}] ❌ Build error:`, error)
    }
  }

  const rebuild = createRebuildQueue(buildBundle)
  await rebuild()
  console.log(`[${name}] Demo: ${url}/?libs=./uncompiled/${name}/index.js`)

  const srcPath = path.join(projectPath, 'src')
  console.log(`[${name}] 👀 Watching ${srcPath}...`)

  fs.watch(srcPath, { recursive: true }, async (_, filename) => {
    if (filename) {
      console.log(`[${name}] 📝 Changed: ${filename}`)
      await rebuild()
    }
  })
}

(async () => {
  const { names, open } = await selectProjects(projects, 'dev')
  if (names.length)
    await develop(names[0], open)
})().catch((error) => {
  console.error('❌ Development server failed:', error)
  process.exitCode = 1
})
