import fs from 'node:fs'
import path from 'node:path'
import servor from 'servor'
import openBrowser from 'servor/utils/openBrowser.js'
import { build as viteBuild } from 'vite'
import { getViteBuildConfig } from './config.ts'
import { getGlobalName } from './names.ts'
import { getEntryFile, getProjects, selectProjects } from './projects.ts'
import { createRebuildQueue } from './rebuild.ts'

async function develop(projectPath: string, name: string, open: boolean, port: number) {
  const uncompiledPath = path.resolve(`docs/uncompiled/${name}`)
  let browserOpened = false

  // Servor enumerates existing directories when installing its Linux watchers.
  fs.mkdirSync(uncompiledPath, { recursive: true })

  const { url } = await servor({
    root: 'docs',
    fallback: 'index.html',
    reload: true,
    port,
  })

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

export async function runDevelop({ port = 8082 }: { port?: number } = {}): Promise<void> {
  const projects = getProjects()
  const { names, open } = await selectProjects(projects, 'dev')
  const name = names[0]
  if (name)
    await develop(projects[name]!, name, open, port)
}
