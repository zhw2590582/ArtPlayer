import type { IncomingMessage, ServerResponse } from 'node:http'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { createGzip, gzipSync } from 'node:zlib'
import { lookup } from 'mrmime'
import { reloadScript } from './reload.ts'

function inside(root: string, file: string): boolean {
  const relative = path.relative(root, file)
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)
}

function error(response: ServerResponse, status: number) {
  response.writeHead(status).end(String(status))
}

function acceptsGzip(request: IncomingMessage): boolean {
  const encodings = (request.headers['accept-encoding'] || '').split(',').map((entry) => {
    const [name = '', ...parameters] = entry.toLowerCase().split(';')
    const quality = parameters.find(value => value.trim().startsWith('q='))
    return { name: name.trim(), quality: quality ? Number(quality.trim().slice(2)) : 1 }
  })
  const quality = (encodings.find(entry => entry.name === 'gzip') || encodings.find(entry => entry.name === '*'))?.quality ?? 0
  return quality > 0 && quality <= 1
}

function html(request: IncomingMessage, response: ServerResponse, content: string) {
  const compressed = acceptsGzip(request)
  const bytes = Buffer.from(`${content}\n${reloadScript}`)
  const body = compressed ? gzipSync(bytes) : bytes
  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.setHeader('Content-Length', body.length)
  response.setHeader('Vary', 'Accept-Encoding')
  if (compressed)
    response.setHeader('Content-Encoding', 'gzip')
  response.end(request.method === 'HEAD' ? undefined : body)
}

const escape = (value: string) => value.replace(/[&<>"']/g, value => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' })[value]!)

export async function serveAsset(root: string, pathname: string, request: IncomingMessage, response: ServerResponse): Promise<void> {
  const requested = path.resolve(root, `.${pathname}`)
  if (!inside(root, requested) || /[\\\0:]/.test(pathname)) {
    error(response, 403)
    return
  }
  let file = requested
  let stat
  try {
    stat = await fs.promises.stat(file)
  }
  catch (failure) {
    if ((failure as NodeJS.ErrnoException).code !== 'ENOENT' && (failure as NodeJS.ErrnoException).code !== 'ENOTDIR')
      throw failure
    if (path.extname(pathname)) {
      error(response, 404)
      return
    }
    file = path.join(root, 'index.html')
    stat = await fs.promises.stat(file)
  }
  if (!inside(root, await fs.promises.realpath(file))) {
    error(response, 403)
    return
  }
  if (stat.isDirectory()) {
    if (!pathname.endsWith('/')) {
      const query = new URL(request.url || '/', 'http://localhost').search
      response.writeHead(301, { Location: `${pathname.split('/').map(encodeURIComponent).join('/')}/${query}` }).end()
      return
    }
    const index = path.join(file, 'index.html')
    if (fs.existsSync(index)) {
      file = index
      stat = await fs.promises.stat(file)
      if (!inside(root, await fs.promises.realpath(file))) {
        error(response, 403)
        return
      }
    }
    else {
      const entries = await fs.promises.readdir(file, { withFileTypes: true })
      const base = pathname.endsWith('/') ? pathname : `${pathname}/`
      html(request, response, `<!doctype html><meta charset="utf-8"><ul>${entries.map(entry => `<li><a href="${escape(base + encodeURIComponent(entry.name) + (entry.isDirectory() ? '/' : ''))}">${escape(entry.name)}</a></li>`).join('')}</ul>`)
      return
    }
  }
  if (!stat.isFile()) {
    error(response, 404)
    return
  }
  if (path.extname(file).toLowerCase() === '.html') {
    html(request, response, await fs.promises.readFile(file, 'utf8'))
    return
  }
  const type = lookup(file) || 'application/octet-stream'
  response.setHeader('Content-Type', type)
  response.setHeader('Last-Modified', stat.mtime.toUTCString())
  response.setHeader('Accept-Ranges', 'bytes')
  let start = 0
  let end = stat.size - 1
  if (request.headers.range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range)
    if (!match || (!match[1] && !match[2]) || !stat.size) {
      response.setHeader('Content-Range', `bytes */${stat.size}`)
      error(response, 416)
      return
    }
    start = match[1] ? Number(match[1]) : Math.max(0, stat.size - Number(match[2]))
    end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) {
      response.setHeader('Content-Range', `bytes */${stat.size}`)
      error(response, 416)
      return
    }
    response.statusCode = 206
    response.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`)
  }
  const compressed = stat.size > 0 && !request.headers.range && acceptsGzip(request) && /^(?:text\/|application\/(?:javascript|json)|image\/svg)/.test(type)
  response.setHeader('Vary', 'Accept-Encoding')
  if (compressed)
    response.setHeader('Content-Encoding', 'gzip')
  else response.setHeader('Content-Length', stat.size ? end - start + 1 : 0)
  if (request.method === 'HEAD' || !stat.size) {
    response.end()
    return
  }
  const stream = fs.createReadStream(file, { start, end })
  if (compressed)
    await pipeline(stream, createGzip(), response)
  else await pipeline(stream, response)
}
