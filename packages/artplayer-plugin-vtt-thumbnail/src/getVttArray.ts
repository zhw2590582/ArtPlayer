import type { Thumbnail } from './types'
import parseVtt from './parseVtt'

// Preserve the historical source helper while registration owns its requests.
export default async function getVttArray(vttUrl = ''): Promise<Thumbnail[]> {
  return parseVtt(await (await fetch(vttUrl)).text(), vttUrl)
}
