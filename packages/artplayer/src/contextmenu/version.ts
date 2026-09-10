import type { ContextmenuOption } from './types'
import { version } from '../../package.json'

export default function (option: ContextmenuOption): ContextmenuOption {
  return {
    ...option,
    html: `<a href="https://artplayer.org" target="_blank" style="width:100%;">ArtPlayer ${version}</a>`,
  }
}
