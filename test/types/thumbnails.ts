import type { ThumbnailsHost } from '../../packages/artplayer/src/player/thumbnailsMix'
import type { ThumbnailGeometry } from '../../packages/artplayer/src/thumbnails/layout'
import type Artplayer from '../../packages/artplayer/types/artplayer'
import type { Thumbnails } from '../../packages/artplayer/types/option'
import { loadImg, loadThumbnailImage } from '../../packages/artplayer/src/image/load'
import ResourceScope from '../../packages/artplayer/src/lifecycle/scope'
import thumbnailsMix from '../../packages/artplayer/src/player/thumbnailsMix'
import { thumbnailLayout } from '../../packages/artplayer/src/thumbnails/layout'

declare const art: Artplayer
declare const host: ThumbnailsHost
declare const geometry: ThumbnailGeometry
const scope = new ResourceScope()
const installed: void = thumbnailsMix(host)
const option: Thumbnails = { url: 'sprite.png', column: 10, number: 100 }
art.thumbnails = option
const current: Thumbnails = art.thumbnails
const image: Promise<HTMLImageElement> = loadImg('sprite.png', 0.5)
const preview: Promise<HTMLImageElement | undefined> = loadThumbnailImage('sprite.png', 0.5, scope)
const layout = thumbnailLayout(option, geometry)
const width: string = layout.width
const left: number | string = layout.left
// @ts-expect-error Scale remains a number.
loadImg('sprite.png', 'half')
// @ts-expect-error Thumbnail configuration requires a URL.
art.thumbnails = { number: 100 }
// @ts-expect-error An owned request may be cancelled before producing an image.
const guaranteed: Promise<HTMLImageElement> = loadThumbnailImage('sprite.png', 1, scope)
export { current, guaranteed, image, installed, left, preview, width }
