import type { ProxyOptions, ShimHost } from './engine-types'
import type { MenuHost } from './m3u8-types'
import type VideoShim from './VideoShim'
import { releaseAll } from './cleanup'
import { setupM3u8Controls } from './m3u8'

export interface EntryHost extends ShimHost, MenuHost {
  constructor: ShimHost['constructor'] & { utils: { createElement: (tag: 'canvas') => HTMLCanvasElement } }
  option: ShimHost['option'] & { autoSize?: boolean }
  template?: { $player?: HTMLElement }
  mediabunny?: unknown
}

export function entryLifecycle(art: EntryHost, canvas: HTMLCanvasElement, shim: VideoShim, option: ProxyOptions) {
  let closed = false
  let controls: ReturnType<typeof setupM3u8Controls>
  function resize(): void {
    if (closed || !art.template?.$player || art.option.autoSize)
      return
    Object.assign(canvas.style, { width: '100%', height: '100%', objectFit: 'contain' })
  }
  function destroy(): void {
    if (closed)
      return
    closed = true
    releaseAll([
      () => controls?.destroy(),
      () => {
        if (art.mediabunny === shim)
          delete art.mediabunny
      },
      () => shim.destroy(),
      () => art.off?.('resize', resize),
      () => art.off?.('video:loadedmetadata', resize),
      () => art.off?.('destroy', destroy),
    ])
  }
  function install(): void {
    art.on('resize', resize)
    art.on('video:loadedmetadata', resize)
    controls = setupM3u8Controls({ art, shim, option })
    art.on('destroy', destroy)
  }
  return { install, destroy }
}
