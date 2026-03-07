import fs from 'node:fs'
import path from 'node:path'
import prompts from 'prompts'
import servor from 'servor'
import openBrowser from 'servor/utils/openBrowser.js'
import { build as viteBuild } from 'vite'
import { getGlobalName, getProjects, getViteBuildConfig } from './utils.js'

const projects = getProjects()

async function develop(name) {
  const projectPath = projects[name]
  const uncompiledPath = path.resolve(`docs/uncompiled/${name}`)
  const entryFile = path.join(projectPath, 'src/index.js')
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
        entry: entryFile,
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

      if (!browserOpened) {
        browserOpened = true
        openBrowser(url)
      }
    }
    catch (error) {
      console.error(`[${name}] ❌ Build error:`, error)
    }
  }

  await buildBundle()

  const srcPath = path.join(projectPath, 'src')
  console.log(`[${name}] 👀 Watching ${srcPath}...`)

  fs.watch(srcPath, { recursive: true }, async (_, filename) => {
    if (filename) {
      console.log(`[${name}] 📝 Changed: ${filename}`)
      await buildBundle()
    }
  })
}

(async () => {
  const { value } = await prompts({
    type: 'select',
    name: 'value',
    message: 'Which project do you want to develop?',
    choices: Object.keys(projects).map(name => ({ title: name, value: name })),
  })
  if (value)
    await develop(value)
})()
