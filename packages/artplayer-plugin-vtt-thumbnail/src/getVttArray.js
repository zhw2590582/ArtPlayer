import parseVtt from './parseVtt'

// Preserve the historical source helper while registration owns its requests.
export default async function getVttArray(vttUrl = '') {
  return parseVtt(await (await fetch(vttUrl)).text(), vttUrl)
}
