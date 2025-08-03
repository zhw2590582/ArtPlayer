import { version } from '../../package.json'

export default function (option) {
  return {
    ...option,
    html: `<a href="https://artplayer.org" target="_blank">ArtPlayer ${version}</a>`,
  }
}
