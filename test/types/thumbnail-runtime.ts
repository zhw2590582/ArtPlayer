import Thumbnail from '../../packages/artplayer-tool-thumbnail/src'

const input = document.createElement('input')
const tool = new Thumbnail({ fileInput: input, number: 10, tracking: { id: 'example' } })
const same: Thumbnail = tool.setup({ width: 80 }).on('update', (url, progress) => {
  const value: string = url
  const percent: number = progress
  void [value, percent]
})
tool.once('file', function (file) {
  this.name = file.name
}, { name: '' })
tool.on('error', (message) => {
  const value: unknown = message
  void value
})
tool.on('custom', (...payload) => {
  const values: unknown[] = payload
  void values
})
tool.emit(Symbol('extension'), 'value')
tool.on('custom-number', (value: number) => value.toFixed())
const pending: Promise<void> = tool.start()
const point: { time: number, x: number, y: number } | undefined = tool.creatScreenshotDate()[0]
const canvas: HTMLCanvasElement = tool.creatCanvas()
const defaults: number = Thumbnail.DEFAULTS.height
const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
tool.setup({ fileInput: wrapper })
tool.loadVideo(input.files?.[0])
tool.loadVideo(null)
const destroyed: void = tool.destroy()
void [same, pending, point, canvas, defaults, destroyed]

// @ts-expect-error Numeric options cannot be strings.
tool.setup({ width: '80' })
// @ts-expect-error A file-input selector string has never been supported.
const invalidInput = new Thumbnail({ fileInput: '#input' })
// @ts-expect-error Known update events carry a URL followed by numeric progress.
tool.emit('update', 123, '50%')
// @ts-expect-error Known callbacks must accept their actual payload.
tool.on('video', (file: File) => file.name)
// @ts-expect-error The public start result is completion, not the thumbnail URL.
const incorrect: Promise<string> = tool.start()
// @ts-expect-error Runtime ESM exposes only a default class, no .default self-alias.
const InvalidAlias = Thumbnail.default
void [incorrect, invalidInput, InvalidAlias]
