import type { ServerResponse } from 'node:http'

export const reloadScript = `<script>(() => {
  const source = new EventSource('/livereload');
  let reloading = false;
  const reload = () => { if (!reloading) { reloading = true; location.reload(); } };
  source.onmessage = reload;
  source.onerror = () => { source.onopen = reload; };
  addEventListener('pagehide', () => source.close(), { once: true });
})();</script>`

export function createReloadChannel() {
  const clients = new Set<ServerResponse>()
  let heartbeat: ReturnType<typeof setInterval> | undefined
  let closed = false
  function stopHeartbeat() {
    clearInterval(heartbeat)
    heartbeat = undefined
  }
  return {
    add(response: ServerResponse) {
      if (closed) {
        response.writeHead(503).end()
        return
      }
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      })
      response.write('event: connected\ndata: ready\n\n')
      clients.add(response)
      response.once('close', () => {
        clients.delete(response)
        if (!clients.size)
          stopHeartbeat()
      })
      if (!heartbeat) {
        heartbeat = setInterval(() => {
          for (const client of clients)
            client.write('event: ping\ndata: waiting\n\n')
        }, 30000)
        heartbeat.unref()
      }
    },
    reload() {
      if (!closed) {
        for (const client of clients)
          client.write('data: reload\n\n')
      }
    },
    close() {
      closed = true
      stopHeartbeat()
      for (const client of clients)
        client.end()
      clients.clear()
    },
  }
}
