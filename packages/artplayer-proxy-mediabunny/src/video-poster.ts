export default class Poster {
  private image: HTMLImageElement | null = null

  cancel(): void {
    if (!this.image)
      return
    this.image.onload = null
    this.image.onerror = null
    this.image = null
  }

  draw(source: string, current: () => boolean, draw: (image: HTMLImageElement) => void, failure: (error: unknown) => void): void {
    this.cancel()
    const image = new Image()
    this.image = image
    image.onload = () => {
      if (this.image !== image || !current())
        return
      this.cancel()
      try {
        draw(image)
      }
      catch (error) {
        failure(error)
      }
    }
    image.onerror = () => {
      if (this.image === image)
        this.cancel()
    }
    image.src = source
  }
}
