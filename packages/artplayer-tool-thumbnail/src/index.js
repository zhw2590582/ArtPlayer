import Emitter from './emitter'
import { connectInput, releaseInput, setupInput } from './input'
import { createSheet, downloadSheet, screenshotPoints } from './sheet'
import { clamp, runPromisesInSeries, sleep } from './utils'

const destroyed = new WeakSet()

export default class ArtplayerToolThumbnail extends Emitter {
  constructor(option = {}) {
    super()
    this.processing = false
    this.option = {}
    try {
      this.setup(Object.assign({}, ArtplayerToolThumbnail.DEFAULTS, option))
      this.video = ArtplayerToolThumbnail.creatVideo()
      this.duration = 0
      this.inputChange = this.inputChange.bind(this)
      this.ondrop = this.ondrop.bind(this)
      connectInput(this, ArtplayerToolThumbnail.ondragover)
    }
    catch (error) {
      try {
        releaseInput(this)
      }
      catch {}
      try {
        if (this.video?.parentNode)
          this.video.parentNode.removeChild(this.video)
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

  static ondragover(event) {
    event.preventDefault()
  }

  ondrop(event) {
    if (destroyed.has(this))
      return
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    this.loadVideo(file)
  }

  setup(option = {}) {
    if (!destroyed.has(this))
      this.option = setupInput(this, option)
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

  inputChange(event) {
    if (destroyed.has(this))
      return
    const file = this.option.fileInput.files[0]
    this.loadVideo(file)
    event.target.value = ''
  }

  loadVideo(file) {
    if (file && !destroyed.has(this)) {
      const canPlayType = this.video.canPlayType(file.type)
      this.errorHandle(
        canPlayType === 'maybe' || canPlayType === 'probably',
        `Playback of this file format is not supported: ${file.type}`,
      )
      const videoUrl = URL.createObjectURL(file)
      this.videoUrl = videoUrl
      this.file = file
      this.emit('file', this.file)
      this.video.src = videoUrl
      this.emit('video', this.video)
    }
  }

  start() {
    if (!this.video.duration)
      return sleep(1000).then(() => this.start())
    const { width, number, begin, end } = this.option
    const height = (this.video.videoHeight / this.video.videoWidth) * width
    this.option.height = height
    this.option.begin = clamp(begin, 0, this.video.duration)
    this.option.end = clamp(end || this.video.duration, begin, this.video.duration)
    this.errorHandle(this.option.end > this.option.begin, `End time must be greater than the start time`)
    this.duration = this.option.end - this.option.begin
    this.density = number / this.duration
    this.errorHandle(this.file && this.video, 'Please select the video file first')
    this.errorHandle(!this.processing, 'There is currently a task in progress, please wait a moment...')
    this.errorHandle(this.density <= 1, `The preview density cannot be greater than 1, but got ${this.density}`)
    const screenshotDate = this.creatScreenshotDate()
    const canvas = this.creatCanvas()
    const context2D = canvas.getContext('2d')
    this.emit('canvas', canvas)
    const promiseList = screenshotDate.map((item, index) => () => {
      return new Promise((resolve) => {
        this.video.oncanplay = () => {
          context2D.drawImage(this.video, item.x, item.y, width, height)
          canvas.toBlob((blob) => {
            if (this.thumbnailUrl) {
              URL.revokeObjectURL(this.thumbnailUrl)
            }
            this.thumbnailUrl = URL.createObjectURL(blob)
            this.emit('update', this.thumbnailUrl, (index + 1) / number)
            this.video.oncanplay = null
            resolve()
          })
        }
        this.video.currentTime = item.time
      })
    })
    this.processing = true
    return runPromisesInSeries(promiseList)
      .then(() => {
        this.processing = false
        this.emit('done')
      })
      .catch((err) => {
        this.processing = false
        this.emit('error', err.message)
        throw err
      })
  }

  creatScreenshotDate() {
    return screenshotPoints(this.option, this.duration)
  }

  creatCanvas() {
    return createSheet(this.option)
  }

  download() {
    this.errorHandle(
      this.file && this.thumbnailUrl,
      'Download does not seem to be ready, please create preview first',
    )
    this.errorHandle(!this.processing, 'There is currently a task in progress, please wait a moment...')
    const name = downloadSheet(this.file, this.thumbnailUrl)
    this.emit('download', name)
    return this
  }

  errorHandle(condition, msg) {
    if (!condition) {
      this.emit('error', msg)
      throw new Error(msg)
    }
  }

  destroy() {
    if (destroyed.has(this))
      return
    destroyed.add(this)
    let failure
    for (const cleanup of [
      () => releaseInput(this),
      () => this.video.parentNode?.removeChild(this.video),
      () => this.videoUrl && URL.revokeObjectURL(this.videoUrl),
      () => this.thumbnailUrl && URL.revokeObjectURL(this.thumbnailUrl),
      () => this.emit('destroy'),
    ]) {
      try {
        cleanup()
      }
      catch (error) { failure ||= error }
    }
    if (failure)
      throw failure
  }
}
