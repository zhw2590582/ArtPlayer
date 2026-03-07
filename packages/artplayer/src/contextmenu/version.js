import { version } from '../../package.json'
import { isBrowser } from '../utils/compatibility'

export default function (option) {
  const url = isBrowser ? location.href : ''
  return {
    ...option,
    html: `<a href="https://artplayer.org?ref=${encodeURIComponent(url)}" target="_blank" style="width:100%;">ArtPlayer ${version}</a>`,
  }
}
