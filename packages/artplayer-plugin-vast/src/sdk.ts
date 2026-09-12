import type { ImaSdk } from '@alugha/ima'
import type { RequestConfig } from './types'

export { loadImaSdk, Player, PlayerOptions } from '@glomex/vast-ima-player'

export function createRequest(ima: ImaSdk, field: 'adTagUrl' | 'adsResponse', value: string, config: RequestConfig) {
  const request = new ima.AdsRequest()
  request[field] = value
  // Preserve the historical SDK extension surface, including inherited config fields.
  const fields = request as unknown as Record<string, unknown>
  for (const key in config)
    fields[key] = config[key]
  return request
}
