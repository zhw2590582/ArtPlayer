import {
  ArtplayerAdapter,
  ArtplayerMetadata,
  BiliCommandGrpcAdapter,
  BiliCommandGrpcMetadata,
  BiliGrpcAdapter,
  BiliGrpcMetadata,
  BiliUpAdapter,
  BiliUpMetadata,
  BiliXmlAdapter,
  BiliXmlMetadata,
  DanuniJsonAdapter,
  DanuniJsonMetadata,
  DanuniPbAdapter,
  DanuniPbMetadata,
  DdplayAdapter,
  DdplayMetadata,
  DplayerAdapter,
  DplayerMetadata,
  TencentAdapter,
  TencentMetadata,
  VodAdapter,
  VodMetadata,
} from '@dan-uni/dan-any/adapters'

export const DEFAULT_HANDLER_LIST = [
  [DanuniJsonMetadata, DanuniJsonAdapter],
  [DanuniPbMetadata, DanuniPbAdapter],
  [BiliXmlMetadata, BiliXmlAdapter],
  [BiliGrpcMetadata, BiliGrpcAdapter],
  [BiliCommandGrpcMetadata, BiliCommandGrpcAdapter],
  [BiliUpMetadata, BiliUpAdapter],
  [ArtplayerMetadata, ArtplayerAdapter],
  [DplayerMetadata, DplayerAdapter],
  [DdplayMetadata, DdplayAdapter],
  [TencentMetadata, TencentAdapter],
  [VodMetadata, VodAdapter],
]

const JSON_ADAPTERS = new Set([
  ArtplayerAdapter,
  DdplayAdapter,
  DplayerAdapter,
  TencentAdapter,
  VodAdapter,
])

export function isUniChunk(source) {
  return !!source && typeof source === 'object' && source.__isUniChunk === true
}

function isFile(source) {
  return typeof File !== 'undefined' && source instanceof File
}

function isIterable(source) {
  return !!source && typeof source !== 'string' && typeof source[Symbol.iterator] === 'function'
}

function isObject(source) {
  return !!source && typeof source === 'object'
}

function getHandlerList(source, option) {
  return source?.handlerList || option.handlerList || DEFAULT_HANDLER_LIST
}

function getBodyHandlerList(handlerList) {
  return handlerList.map(([metadata]) => metadata)
}

function getFnHandlerList(handlerList, filename) {
  const result = []

  for (let index = 0; index < handlerList.length; index++) {
    const [metadata, adapter] = handlerList[index]

    if (metadata.check?.fn) {
      if (metadata.check.fn(filename))
        result.push([metadata, adapter])
    }
    else {
      if (filename.includes(metadata.type))
        return [[metadata, adapter]]

      if (metadata.ext.some(ext => filename.endsWith(ext)))
        result.push([metadata, adapter])
    }
  }

  return result
}

function normalizeExt(ext) {
  if (!ext)
    return ''

  return ext.startsWith('.') ? ext : `.${ext}`
}

function appendExt(name, ext) {
  const normalized = normalizeExt(ext)
  if (!normalized)
    return name

  if (name.endsWith(normalized))
    return name

  return `${name || 'danmaku'}${normalized}`
}

function getUrlPathname(url) {
  try {
    return new URL(url, globalThis.location?.href).pathname || url
  }
  catch {
    return url.split('?')[0].split('#')[0]
  }
}

function getDetectName({ url, filename, ext }) {
  return appendExt(filename || (url ? getUrlPathname(url) : ''), ext)
}

async function fetchUrlBody(url, init) {
  const response = await fetch(url, init)

  if (!response.ok)
    throw new Error(`Failed to fetch danmaku source: ${response.status} ${response.statusText}`)

  return response.arrayBuffer()
}

async function parseJsonBody(body) {
  if (typeof body === 'object' && body && !(body instanceof ArrayBuffer) && !ArrayBuffer.isView(body)) {
    if (isFile(body))
      return body.json()

    return body
  }

  if (typeof body === 'string')
    return JSON.parse(body)

  const buffer = body instanceof ArrayBuffer
    ? body
    : new Uint8Array(body.buffer, body.byteOffset, body.byteLength)

  return JSON.parse(new TextDecoder().decode(buffer))
}

async function getAdapterBody(adapter, body) {
  if (JSON_ADAPTERS.has(adapter))
    return parseJsonBody(body)

  return body
}

async function deleteChunk(chunk) {
  if (chunk && typeof chunk.delete === 'function')
    await chunk.delete()
}

async function finishAdapter(udb, adapter, body, chunk) {
  const adapterBody = await getAdapterBody(adapter, body)
  const target = chunk || udb

  return {
    chunk: await target.import(adapter(adapterBody, undefined, undefined)),
    owned: true,
  }
}

async function loadByName(udb, handlerList, detectName, body) {
  const filtered = getFnHandlerList(handlerList, detectName)

  return loadByBody(udb, filtered, body)
}

async function loadByBody(udb, handlerList, body) {
  const chunk = await udb.makeChunk({ tmp: true })
  const metadataList = getBodyHandlerList(handlerList)

  for (let index = 0; index < metadataList.length; index++) {
    const metadata = metadataList[index]

    if (metadata.check?.body) {
      const adapter = await metadata.check.body(body)

      if (adapter !== null) {
        await deleteChunk(chunk)
        return finishAdapter(udb, adapter, body)
      }
    }

    if (metadata.check?.adapter) {
      const result = await metadata.check.adapter(chunk, body)

      if (isUniChunk(result)) {
        return {
          chunk: result,
          owned: true,
        }
      }

      if (typeof result === 'function')
        return finishAdapter(udb, result, body, chunk)
    }
  }

  await deleteChunk(chunk)
  throw new Error('Cannot detect danmaku source format')
}

async function loadIterable(udb, source) {
  const chunk = await udb.makeChunk({ tmp: true })
  const udanmakus = Array.from(source)

  if (udanmakus.length)
    await chunk.upsertDanmakus(udanmakus, false, false)

  return {
    chunk,
    owned: true,
  }
}

export async function resolveSource(udb, source, option) {
  if (isUniChunk(source)) {
    // 提取 $danmakus 创建新的 pure 后端 UniChunk
    // 这样可以解决传入的弹幕为 drizzle 等其它后端的 UniChunk 的情况
    return loadIterable(udb, await source.$danmakus)
  }

  if (isFile(source)) {
    return loadByName(udb, getHandlerList(source, option), source.name, source)
  }

  if (typeof source === 'string') {
    const body = await fetchUrlBody(source)
    return loadByName(
      udb,
      getHandlerList(null, option),
      getDetectName({ url: source }),
      body,
    )
  }

  if (isObject(source) && typeof source.url === 'string') {
    const body = await fetchUrlBody(source.url, source.init)
    return loadByName(
      udb,
      getHandlerList(source, option),
      getDetectName(source),
      body,
    )
  }

  if (isObject(source) && isFile(source.file)) {
    const detectName = getDetectName({
      filename: source.filename || source.file.name,
      ext: source.ext,
    })

    return loadByName(udb, getHandlerList(source, option), detectName, source.file)
  }

  if (isObject(source) && 'data' in source) {
    const handlerList = getHandlerList(source, option)
    const detectName = getDetectName(source)

    if (detectName)
      return loadByName(udb, handlerList, detectName, source.data)

    return loadByBody(udb, handlerList, source.data)
  }

  if (isIterable(source))
    return loadIterable(udb, source)

  throw new Error('Unsupported danmaku source')
}
