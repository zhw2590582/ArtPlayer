function getMode(key) {
  switch (key) {
    case 1:
    case 2:
    case 3:
      return 0
    case 4:
      return 2
    case 5:
      return 1
    default:
      return 0
  }
}

function bilibiliDanmuParseFromXml(xmlString) {
  if (typeof xmlString !== 'string')
    return []
  const reg = /<d[^>]*?p="(?<p>[^"]+)"[^>]*>(?<text>.*?)<\/d>/gs
  const matches = xmlString.matchAll(reg)
  return Array.from(matches)
    .map((match) => {
      const attr = match.groups.p.split(',')
      if (attr.length >= 8) {
        const text = match.groups.text
          .trim()
          .replaceAll('&quot;', '"')
          .replaceAll('&apos;', '\'')
          .replaceAll('&lt;', '<')
          .replaceAll('&gt;', '>')
          .replaceAll('&amp;', '&')

        return {
          text,
          time: Number(attr[0]),
          mode: getMode(Number(attr[1])),
          fontSize: Number(attr[2]),
          color: `#${Number(attr[3]).toString(16)}`,
          timestamp: Number(attr[4]),
          pool: Number(attr[5]),
          userID: attr[6],
          rowID: Number(attr[7]),
        }
      }
      else {
        return null
      }
    })
    .filter(Boolean)
}

function onmessage({ data }) {
  const { xml, id } = data
  if (!id || !xml)
    return
  const danmus = bilibiliDanmuParseFromXml(xml)
  globalThis.postMessage({ danmus, id })
}

function createWorker() {
  const workerText = `
        ${getMode.toString()}
        ${bilibiliDanmuParseFromXml.toString()}
        onmessage = ${onmessage.toString()}
    `
  const blob = new Blob([workerText], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

export function bilibiliDanmuParseFromUrl(url) {
  return (async () => {
    const res = await fetch(url)
    if (!res.ok)
      throw new Error(`[artplayerPluginDanmuku] danmaku request failed: ${res.status} ${url}`)
    const xml = await res.text()

    return await new Promise((resolve, reject) => {
      try {
        const worker = createWorker()
        const timeout = setTimeout(() => reject(new Error('danmuku parse timeout')), 10000)
        worker.terminate()
        worker.onmessage = (event) => {
          const { danmus, id } = event.data
          if (!id || !danmus)
            return
          clearTimeout(timeout)
          resolve(danmus)
          worker.terminate()
        }
        worker.onerror = (error) => {
          clearTimeout(timeout)
          reject(error)
        }
        worker.postMessage({ xml, id: Date.now() })
      }
      catch (error) {
        console.error('Error parsing Bilibili Danmu:', error)
        resolve(bilibiliDanmuParseFromXml(xml))
      }
    })
  })()
}
