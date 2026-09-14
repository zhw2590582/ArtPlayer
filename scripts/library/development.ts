import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import openBrowser from 'servor/utils/openBrowser.js'
import { build as viteBuild } from 'vite'
import { getViteBuildConfig } from './config.ts'
import { getGlobalName } from './names.ts'
import { getEntryFile, getProjects, selectProjects } from './projects.ts'
import { createRebuildQueue } from './rebuild.ts'
import { startDevServer } from './server.ts'

export interface DevelopmentOptions {
  root?: string
  port?: number
  signal?: AbortSignal
}

export async function startDevelopment(projectPath: string, name: string, open: boolean, { root = process.cwd(), port = 8082, signal }: DevelopmentOptions = {}) {
  const uncompiledPath = path.resolve(root, `docs/uncompiled/${name}`)
  let browserOpened = false
  let stopped = false
  let failure: Error | undefined
  let watcher: fs.FSWatcher | undefined
  let activeBuild = Promise.resolve()
  let closing: Promise<void> | undefined
  let finish!: () => void
  let reject!: (error: Error) => void
  const done = new Promise<void>((resolve, failed) => {
    finish = resolve
    reject = failed
  })
  // Startup can fail before the caller receives the session; retain rejection for its owner.
  void done.catch(() => {})
  const startup = startDevServer({
    root: path.join(root, 'docs'),
    port,
    ignoredDirectory: uncompiledPath,
    onError: fatal,
  })
  function fatal(error: Error) {
    if (stopped)
      return
    failure ??= error
    void close().catch(() => {})
  }
  function aborted() {
    void close().catch(() => {})
  }
  function close(): Promise<void> {
    if (!closing) {
      stopped = true
      watcher?.close()
      signal?.removeEventListener('abort', aborted)
      closing = (async () => {
        const server = await startup.catch(() => undefined)
        await server?.close()
        await activeBuild
        if (failure)
          throw failure
      })()
      void closing.then(finish, reject)
    }
    return closing
  }
  signal?.addEventListener('abort', aborted, { once: true })
  try {
    const server = await startup
    if (signal?.aborted || stopped) {
      await close()
      return { url: server.url, close, done }
    }
    fs.mkdirSync(uncompiledPath, { recursive: true })
    async function buildBundle() {
      if (stopped)
        return
      const startTime = Date.now()
      try {
        const config = getViteBuildConfig({ entry: getEntryFile(projectPath), outDir: uncompiledPath, name: getGlobalName(name), format: 'iife', fileName: 'index.js', minify: false, emptyOutDir: true })
        config.define['process.env.NODE_ENV'] = JSON.stringify('development')
        await viteBuild({ root: projectPath, ...config })
        if (stopped)
          return
        console.log(`[${name}] ✅ Built in ${Date.now() - startTime}ms`)
        server.reload()
        if (open && !browserOpened) {
          browserOpened = true
          openBrowser(server.url)
        }
      }
      catch (error) {
        if (!stopped)
          console.error(`[${name}] ❌ Build error:`, error)
      }
    }
    const queue = createRebuildQueue(buildBundle)
    function rebuild() {
      if (!stopped)
        activeBuild = queue()
      return activeBuild
    }
    const srcPath = path.join(projectPath, 'src')
    watcher = fs.watch(srcPath, { recursive: true }, (_, filename) => {
      if (filename && !stopped) {
        console.log(`[${name}] 📝 Changed: ${filename}`)
        void rebuild().catch(fatal)
      }
    })
    watcher.on('error', fatal)
    void rebuild().then(() => {
      if (!stopped) {
        console.log(`[${name}] Demo: ${server.url}/?libs=./uncompiled/${name}/index.js`)
        console.log(`[${name}] 👀 Watching ${srcPath}...`)
      }
    }, fatal)
    return { url: server.url, close, done }
  }
  catch (error) {
    await close()
    throw error
  }
}

export async function runDevelop({ port = 8082, signal }: DevelopmentOptions = {}) {
  const projects = getProjects()
  const { names, open } = await selectProjects(projects, 'dev')
  const name = names[0]
  if (name)
    return startDevelopment(projects[name]!, name, open, { port, signal })
}
