import type { Lifetime } from './types'

export default async function requestVtt(url = '', lifetime: Lifetime): Promise<string | void> {
  if (lifetime.closed)
    return
  const controller = typeof AbortController === 'function' ? new AbortController() : null
  const release = lifetime.own(() => controller?.abort())
  try {
    if (lifetime.closed)
      return
    const response = await lifetime.wait(controller ? fetch(url, { signal: controller.signal }) : fetch(url))
    if (lifetime.closed)
      return
    if (response!.ok === false)
      throw new Error(`Failed to fetch VTT thumbnails: HTTP ${response!.status}`)
    if (lifetime.closed)
      return
    return await lifetime.wait(response!.text())
  }
  finally {
    release()
  }
}
