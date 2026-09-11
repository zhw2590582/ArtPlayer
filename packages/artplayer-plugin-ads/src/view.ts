import type { Resources } from './resources'
import type { Cleanup, Icons, Options, Utilities } from './types'

const translate = (value: number, text: string) => text.replace('%s', String(value))

export function createView(parent: HTMLElement, icons: Icons, option: Options, utils: Utilities, own: (root: HTMLElement) => void) {
  const { append, query, setStyle } = utils
  // The private markup below fixes the element kind; public append/query retain their broad types.
  const root = append(parent, '<div class="artplayer-plugin-ads"></div>') as HTMLElement
  own(root)
  const content = append(root, option.video
    ? '<video class="artplayer-plugin-ads-video" loop playsInline></video>'
    : `<div class="artplayer-plugin-ads-html">${option.html}</div>`) as HTMLElement
  const video = option.video ? content as HTMLVideoElement : null
  const loading = append(root, '<div class="artplayer-plugin-ads-loading"></div>') as HTMLElement
  append(loading, icons.loading)
  const timer = append(root, `<div class="artplayer-plugin-ads-timer">
    <div class="artplayer-plugin-ads-close"></div>
    <div class="artplayer-plugin-ads-countdown"></div>
  </div>`) as HTMLElement
  const close = query('.artplayer-plugin-ads-close', timer) as HTMLElement
  const countdown = query('.artplayer-plugin-ads-countdown', timer) as HTMLElement
  const control = append(root, `<div class="artplayer-plugin-ads-control">
    <div class="artplayer-plugin-ads-detail">${option.i18n.detail}</div>
    <div class="artplayer-plugin-ads-muted"></div>
    <div class="artplayer-plugin-ads-fullscreen"></div>
  </div>`) as HTMLElement
  const detail = query('.artplayer-plugin-ads-detail', control) as HTMLElement
  const muted = query('.artplayer-plugin-ads-muted', control) as HTMLElement
  const fullscreen = query('.artplayer-plugin-ads-fullscreen', control) as HTMLElement
  let canClose = option.playDuration <= 0

  if (option.playDuration >= option.totalDuration)
    setStyle(close, 'display', 'none')
  if (!option.url)
    setStyle(detail, 'display', 'none')
  if (video) {
    append(muted, icons.volume)
    append(muted, icons.volumeClose)
    video.muted = Boolean(option.muted)
    syncMuted()
  }
  else {
    setStyle(muted, 'display', 'none')
  }
  append(fullscreen, icons.fullscreenOn)
  append(fullscreen, icons.fullscreenOff)

  function syncMuted(): void {
    setStyle(icons.volume, 'display', video?.muted ? 'none' : 'inline-flex')
    setStyle(icons.volumeClose, 'display', video?.muted ? 'inline-flex' : 'none')
  }

  function render(elapsed: number): void {
    const remaining = option.playDuration - elapsed
    canClose = elapsed === 0 ? option.playDuration <= 0 : remaining < 1 || Number.isNaN(remaining)
    close.innerHTML = canClose ? option.i18n.close : translate(remaining, option.i18n.canBeClosed)
    countdown.innerHTML = translate(option.totalDuration - elapsed, option.i18n.countdown)
  }
  render(0)

  return {
    root,
    video,
    render,
    ready() {
      setStyle(timer, 'display', 'flex')
      setStyle(control, 'display', 'flex')
      setStyle(loading, 'display', 'none')
    },
    hide() { setStyle(root, 'display', 'none') },
    fullscreen(active: boolean) {
      setStyle(icons.fullscreenOn, 'display', active ? 'none' : 'inline-flex')
      setStyle(icons.fullscreenOff, 'display', active ? 'inline-flex' : 'none')
    },
    bind(events: Resources, callbacks: { skip: Cleanup, click: Cleanup, fullscreen: Cleanup }) {
      events.dom(close, 'click', () => {
        if (canClose)
          callbacks.skip()
      })
      events.dom(content, 'click', callbacks.click)
      if (option.url)
        events.dom(detail, 'click', callbacks.click)
      if (video) {
        events.dom(muted, 'click', () => {
          video.muted = !video.muted
          syncMuted()
        })
      }
      events.dom(fullscreen, 'click', callbacks.fullscreen)
    },
  }
}

export type View = ReturnType<typeof createView>
