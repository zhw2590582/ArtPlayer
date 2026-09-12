import type { InputOptions, RuntimeOptions, ThumbnailEvents } from './types'
import Emitter from './emitter'
import { startExtraction } from './extraction'
import { connectInput, releaseInput, setupInput } from './input'
import { cleanupAll, closeState, releaseMedia, stateFor } from './lifecycle'
import { createSheet, downloadSheet, screenshotPoints } from './sheet'
import { loadSource } from './source'

export default class ArtplayerToolThumbnail extends Emitter<ThumbnailEvents> {
  declare processing: boolean
  declare option: RuntimeOptions
  declare video: HTMLVideoElement
  declare duration: number
  declare density: number | undefined
  declare file: File | undefined
  declare videoUrl: string | undefined
  declare thumbnailUrl: string | undefined

  constructor(option: InputOptions = {}) {
    super()
    this.processing = false
    // setup validates the temporary empty options before construction can succeed.
    this.option = {} as RuntimeOptions
    try {
      this.setup(Object.assign({}, ArtplayerToolThumbnail.DEFAULTS, option))
      this.video = ArtplayerToolThumbnail.creatVideo()
      stateFor(this).video = this.video
      this.duration = 0
      this.inputChange = this.inputChange.bind(this)
      this.ondrop = this.ondrop.bind(this)
      connectInput(this, ArtplayerToolThumbnail.ondragover)
    }
    catch (error) {
      closeState(this, 'construction failed')
      try {
        releaseInput(this)
      }
      catch {}
      try {
        releaseMedia(this)
      }
      catch {}
      throw error
    }
  }

  static get DEFAULTS() {
    return {
      number: 60,
      width: 160,
      height: 90,
      column: 10,
      begin: 0,
      end: Number.NaN,
    }
  }

  static ondragover(event: DragEvent) {
    event.preventDefault()
  }

  ondrop(event: DragEvent) {
    if (stateFor(this).closed)
      return
    event.preventDefault()
    const file = event.dataTransfer!.files[0]
    this.loadVideo(file)
  }

  setup(option: InputOptions = {}) {
    if (!stateFor(this).closed)
      setupInput(this, option)
    return this
  }

  static creatVideo() {
    const video = document.createElement('video')
    video.style.position = 'absolute'
    video.style.top = '-9999px'
    video.style.left = '-9999px'
    video.muted = true
    video.controls = true
    try {
      document.body.appendChild(video)
    }
    catch (error) {
      if (video.parentNode)
        video.parentNode.removeChild(video)
      throw error
    }
    return video
  }

  inputChange(event: Event) {
    if (stateFor(this).closed)
      return
    const file = this.option.fileInput.files![0]
    this.loadVideo(file)
    ;(event.target as HTMLInputElement).value = ''
  }

  loadVideo(file?: File | null) {
    loadSource(this, file)
  }

  start() {
    return startExtraction(this)
  }

  creatScreenshotDate() {
    return screenshotPoints(this.option, this.duration)
  }

  creatCanvas() {
    return createSheet(this.option)
  }

  download() {
    if (stateFor(this).closed)
      return this
    this.errorHandle(
      this.file && this.thumbnailUrl,
      'Download does not seem to be ready, please create preview first',
    )
    this.errorHandle(!this.processing, 'There is currently a task in progress, please wait a moment...')
    const name = downloadSheet(this.file!, this.thumbnailUrl!)
    this.emit('download', name)
    return this
  }

  errorHandle(condition: unknown, msg: string) {
    if (!condition) {
      this.emit('error', msg)
      throw new Error(msg)
    }
  }

  destroy() {
    if (!closeState(this))
      return
    cleanupAll([
      () => releaseInput(this),
      () => releaseMedia(this),
      () => this.emit('destroy'),
    ])
  }
}
