import type { Socket } from 'node:net'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { serveAsset } from './assets.ts'
import { createReloadChannel } from './reload.ts'

export interface DevServerOptions {
  root: string
  port: number
  ignoredDirectory?: string
  onError: (error: Error) => void
}

export async function startDevServer(options: DevServerOptions) {
  const root = await fs.promises.realpath(options.root)
  const reload = createReloadChannel()
  const sockets = new Set<Socket>()
  const requests = new Set<Promise<void>>()
  let watcher: fs.FSWatcher | undefined
  let debounce: ReturnType<typeof setTimeout> | undefined
  let closing: Promise<void> | undefined
  const server = http.createServer((request, response) => {
    if (closing) {
      response.writeHead(503).end()
      return
    }
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Cache-Control', 'no-store')
    if (request.method === 'OPTIONS') {
      response.writeHead(204, { 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS' }).end()
      return
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD, OPTIONS' }).end()
      return
    }
    let pathname: string
    try {
      pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname)
    }
    catch {
      response.writeHead(400).end()
      return
    }
    if (pathname === '/livereload') {
      if (request.method === 'HEAD')
        response.writeHead(200, { 'Content-Type': 'text/event-stream' }).end()
      else reload.add(response)
      return
    }
    const active = serveAsset(root, pathname, request, response).catch((error: NodeJS.ErrnoException) => {
      if (!response.destroyed && !response.headersSent)
        response.writeHead(error.code === 'ENOENT' ? 404 : 500).end()
      else response.destroy()
    }).finally(() => requests.delete(active))
    requests.add(active)
  })
  server.on('connection', (socket) => {
    sockets.add(socket)
    socket.once('close', () => sockets.delete(socket))
  })
  function close(): Promise<void> {
    if (!closing) {
      watcher?.close()
      clearTimeout(debounce)
      reload.close()
      closing = new Promise<void>((resolve, reject) => {
        server.close((error?: NodeJS.ErrnoException) => {
          if (error && error.code !== 'ERR_SERVER_NOT_RUNNING')
            reject(error)
          else void Promise.all(requests).then(() => resolve(), reject)
        })
        for (const socket of sockets)
          socket.destroy()
      })
    }
    return closing
  }
  function fail(error: Error) {
    if (closing)
      return
    const pending = close()
    options.onError(error)
    void pending.catch(options.onError)
  }
  try {
    await new Promise<void>((resolve, reject) => {
      function failed(error: Error) {
        server.off('listening', ready)
        reject(error)
      }
      function ready() {
        server.off('error', failed)
        resolve()
      }
      server.once('error', failed)
      server.once('listening', ready)
      server.listen(options.port)
    })
    server.on('error', fail)
    watcher = fs.watch(root, { recursive: true }, (_, filename) => {
      if (closing)
        return
      const file = filename && path.resolve(root, filename)
      if (file && options.ignoredDirectory && (file === options.ignoredDirectory || file.startsWith(`${options.ignoredDirectory}${path.sep}`)))
        return
      clearTimeout(debounce)
      debounce = setTimeout(() => reload.reload(), 75)
    })
    watcher.on('error', fail)
    const address = server.address()
    if (!address || typeof address === 'string')
      throw new Error('Development server did not bind a TCP port')
    return { url: `http://localhost:${address.port}`, reload: reload.reload, close }
  }
  catch (error) {
    await close()
    throw error
  }
}
