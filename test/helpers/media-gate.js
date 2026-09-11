import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import http from 'node:http'

// Serves real media bytes, withholding the tail until a test observes native starvation.
export async function createMediaGate(bytes, contentType, limit, completeRanges = false) {
  assert(Number.isSafeInteger(limit) && limit > 0 && limit < bytes.length)
  const requests = []
  const pending = new Map()
  let released = false
  const etag = `"${createHash('sha256').update(bytes).digest('hex')}"`
  const server = http.createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method) || !req.url.startsWith('/media.')) {
      res.writeHead(404).end()
      return
    }
    let start = 0
    let end = bytes.length - 1
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range)
      start = match?.[1] ? Number(match[1]) : Math.max(0, bytes.length - Number(match?.[2]))
      end = match?.[1] && match[2] ? Math.min(bytes.length - 1, Number(match[2])) : bytes.length - 1
      if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) || start > end || start >= bytes.length) {
        res.writeHead(416, { 'Content-Range': `bytes */${bytes.length}` }).end()
        return
      }
      res.statusCode = 206
      if (completeRanges && !released && start < limit)
        end = Math.min(end, limit - 1)
      res.setHeader('Content-Range', `bytes ${start}-${end}/${bytes.length}`)
    }
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', end - start + 1)
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('ETag', etag)
    res.setHeader('Access-Control-Allow-Origin', '*')
    const record = { method: req.method, range: req.headers.range || null, start, end, sent: 0, wasHeld: false, closed: false }
    requests.push(record)
    res.on('close', () => {
      record.closed = true
      pending.delete(res)
    })
    res.on('error', (error) => {
      record.error = error.message
    })
    if (req.method === 'HEAD') {
      res.end()
      return
    }
    const availableEnd = released ? end + 1 : Math.min(end + 1, limit)
    const sentEnd = Math.max(start, availableEnd)
    if (sentEnd > start) {
      res.write(bytes.subarray(start, sentEnd))
      record.sent += sentEnd - start
    }
    if (sentEnd > end) {
      res.end()
    }
    else {
      record.wasHeld = true
      pending.set(res, { offset: sentEnd, end, record })
      res.flushHeaders()
    }
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  return {
    url: `http://127.0.0.1:${address.port}/media.${contentType === 'video/mp4' ? 'mp4' : 'm4a'}`,
    requests,
    get blocked() { return pending.size },
    release() {
      released = true
      for (const [res, { offset, end, record }] of pending) {
        if (!res.destroyed) {
          record.sent += end + 1 - offset
          res.end(bytes.subarray(offset, end + 1))
        }
      }
      pending.clear()
    },
    async close() {
      server.closeAllConnections()
      await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
    },
  }
}
