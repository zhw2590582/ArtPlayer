import type { CaptureMedia } from '../capture/frame'
import { captureBlobUrl, drawFrame } from '../capture/frame'
import { isClosing } from '../lifecycle/instance'
import { captureSource } from '../source/operation'
import { def, download, secondToTime } from '../utils'

export interface ScreenshotHost {
  template: { $video: CaptureMedia }
  notice: { set show(value: unknown) }
  getDataURL: () => Promise<string>
  emit: (name: 'screenshot', dataUri: string) => unknown
}

export default function screenshotMix(art: ScreenshotHost): void {
  const { notice, template: { $video } } = art
  const canvas = document.createElement('canvas')

  function capture(blob: boolean): Promise<string> {
    const active = captureSource(art)
    // Draw synchronously as before; awaiting must not capture a later frame.
    return new Promise<string>((resolve, reject) => {
      const fail = (error: unknown) => {
        try {
          if (!isClosing(art) && active())
            notice.show = error
        }
        catch (noticeError) {
          reject(noticeError)
          return
        }
        reject(error)
      }
      try {
        drawFrame(canvas, $video)
        if (blob) {
          // Handle failures inside toBlob as well as synchronous canvas errors.
          captureBlobUrl(canvas, resolve, fail)
        }
        else {
          resolve(canvas.toDataURL('image/png'))
        }
      }
      catch (error) {
        fail(error)
      }
    })
  }

  def(art, 'getDataURL', { value: () => capture(false) })
  def(art, 'getBlobUrl', { value: () => capture(true) })
  def(art, 'screenshot', {
    value: async (name?: string): Promise<string> => {
      const active = captureSource(art)
      const dataUri = await art.getDataURL()
      if (!isClosing(art) && active()) {
        const fileName = name || `artplayer_${secondToTime($video.currentTime)}`
        if (!isClosing(art) && active())
          download(dataUri, `${fileName}.png`)
        if (!isClosing(art) && active())
          art.emit('screenshot', dataUri)
      }
      return dataUri
    },
  })
}
