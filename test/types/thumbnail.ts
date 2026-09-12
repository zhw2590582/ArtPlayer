import type { EventArgs, Option, ScreenshotPoint } from 'artplayer-tool-thumbnail'
import Thumbnail from 'artplayer-tool-thumbnail'
import Legacy from 'artplayer-tool-thumbnail/legacy'

const input = document.createElement('input')
const option: Option = { fileInput: input, number: 10, width: 80, custom: { id: 1 } }
const tool: Thumbnail = new Thumbnail(option)
const legacy: Thumbnail = new Legacy(option)
const duration: number = tool.duration
const file: File | undefined = tool.file
const url: string | undefined = tool.thumbnailUrl
const pending: Promise<void> = tool.start()
const canvas: HTMLCanvasElement = tool.creatCanvas()
const points: ScreenshotPoint[] = tool.creatScreenshotDate()
const extension: unknown = tool.option.custom
const progress: EventArgs<'update'> = ['blob:sheet', 0.5]
tool.on('file', file => file.name)
tool.on('video', video => video.videoWidth)
tool.on('canvas', canvas => canvas.width)
tool.on('update', (url, progress) => url + progress.toFixed())
tool.on('error', (message) => {
  if (typeof message === 'string')
    message.toUpperCase()
})
tool.on('custom', (count: number, label: string) => label + count.toFixed())
tool.once(Symbol('custom'), (value: { id: number }) => value.id)
tool.on('update', function (url, progress) {
  this.last = `${url}:${progress}`
}, { last: '' })
tool.emit('update', ...progress).emit('custom', 1, 'one')
tool.off('file').setup({ width: 100 }).download()
tool.loadVideo(input.files?.[0])
tool.loadVideo(null)
const defaults: Thumbnail.SheetOptions = Thumbnail.DEFAULTS
const end: void = tool.destroy()
void [legacy, duration, file, url, pending, canvas, points, extension, defaults, end]

// @ts-expect-error Numeric width is required.
tool.setup({ width: '80' })
// @ts-expect-error Selectors have never been resolved by the tool.
const wrongInput = new Thumbnail({ fileInput: '#input' })
// @ts-expect-error File input is not a media source URL.
tool.loadVideo('video.mp4')
// @ts-expect-error Progress is numeric and follows the URL.
tool.emit('update', 0.5, 'blob:sheet')
// @ts-expect-error File callbacks receive files, not media elements.
tool.on('file', (value: HTMLVideoElement) => value.duration)
// @ts-expect-error Completion returns no URL.
const wrongResult: Promise<string> = tool.start()
// @ts-expect-error The direct constructor has no runtime .default self-alias.
const WrongAlias = Thumbnail.default
// @ts-expect-error density is absent until extraction preflight.
const earlyDensity: number = tool.density
// @ts-expect-error Error listeners must narrow arbitrary thrown message values.
tool.on('error', (message: string) => message.length)
// @ts-expect-error Built-in done does not carry a file.
tool.emit('done', input.files?.[0])
void [wrongInput, wrongResult, WrongAlias, earlyDensity]
