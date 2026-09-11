import type { Thumbnails } from '../../types/option'
import type { SubscriptionHost } from '../component/resources'
import { entryScope } from '../component/resources'
import { eventSubscriptions } from '../events/subscriptions'
import { loadThumbnailImage } from '../image/load'
import { getScope, isClosing } from '../lifecycle/instance'
import { captureSource } from '../source/operation'
import { thumbnailLayout } from '../thumbnails/layout'
import { def, isMobile, setStyle } from '../utils'

interface ThumbnailEvents {
  setBar: [type: string, percentage: number, event?: Event]
}

export interface ThumbnailsHost extends SubscriptionHost<ThumbnailEvents> {
  option: { thumbnails: Thumbnails, isLive: boolean }
  template: { $progress: HTMLElement, $video: { videoWidth: number, videoHeight: number } }
  controls?: { thumbnails?: HTMLDivElement }
}

export default function thumbnailsMix(art: ThumbnailsHost): void {
  const { option, template: { $progress, $video } } = art
  let scope = getScope(art).child()
  let image: HTMLImageElement | undefined
  let loading = false
  let control: HTMLDivElement | undefined
  let hover: { percentage: number, element: HTMLDivElement, sourceActive: () => boolean } | undefined

  function reset(): void {
    const previous = scope
    scope = getScope(art).child()
    image = undefined
    loading = false
    hover = undefined
    previous.dispose()
  }

  function render(): void {
    const current = hover
    const currentScope = scope
    if (!current || !image)
      return
    const active = () => !isClosing(art) && !currentScope.closed && scope === currentScope
      && hover === current && current.sourceActive() && art.controls?.thumbnails === current.element
    if (!active())
      return
    const position = $progress.clientWidth * current.percentage
    if (!(position > 0 && position < $progress.clientWidth))
      return
    const styles = {
      backgroundImage: `url(${image.src})`,
      ...thumbnailLayout(option.thumbnails, {
        imageWidth: image.naturalWidth,
        videoWidth: $video.videoWidth,
        videoHeight: $video.videoHeight,
        progressWidth: $progress.clientWidth,
        position,
      }),
    }
    for (const [key, value] of Object.entries(styles)) {
      if (!active())
        return
      setStyle(current.element, key, value)
    }
  }

  eventSubscriptions<ThumbnailEvents>(art)('setBar', (type, percentage, event) => {
    const element = art.controls?.thumbnails
    const { url, scale } = option.thumbnails
    if (isClosing(art) || !element || !url || !(type === 'hover' || (type === 'played' && event && isMobile)))
      return
    if (control !== element) {
      const elementScope = entryScope(element)
      if (elementScope.closed)
        return
      control = element
      elementScope.add(() => {
        if (control === element) {
          control = undefined
          reset()
        }
      })
    }
    hover = { percentage, element, sourceActive: captureSource(art) }
    if (image) {
      render()
    }
    else if (!loading) {
      const currentScope = scope
      loading = true
      loadThumbnailImage(url, scale, currentScope).then((loaded) => {
        if (scope !== currentScope || currentScope.closed)
          return
        loading = false
        image = loaded
        render()
      }).catch((error: unknown) => {
        if (scope === currentScope && !currentScope.closed) {
          loading = false
          console.warn('ArtPlayer thumbnail load failed:', error)
        }
      })
    }
  })

  def(art, 'thumbnails', {
    get: () => art.option.thumbnails,
    set: (thumbnails: Thumbnails) => {
      if (!isClosing(art) && thumbnails.url && !art.option.isLive && !isClosing(art)) {
        art.option.thumbnails = thumbnails
        reset()
      }
    },
  })
}
