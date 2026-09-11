import { setStyleText } from '../style/inject'
import { isBrowser } from '../utils/compatibility'

export default function publishBrowserEntry<Constructor extends { version: string, LOG_VERSION: boolean }>(Artplayer: Constructor, style: string): void {
  if (!isBrowser)
    return
  (window as Window & { Artplayer?: Constructor }).Artplayer = Artplayer
  setStyleText('artplayer-style', style)

  setTimeout(() => {
    if (Artplayer.LOG_VERSION) {
      // eslint-disable-next-line no-console
      console.log(
        `%c ArtPlayer %c ${Artplayer.version} %c https://artplayer.org`,
        'color: #fff; background: #5f5f5f',
        'color: #fff; background: #4bc729',
        '',
      )
    }
  }, 100)
}
