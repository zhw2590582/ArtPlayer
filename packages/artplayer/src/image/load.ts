import ResourceScope from '../lifecycle/scope'

function requestImage(url: string, scale: number | undefined, owner: undefined): Promise<HTMLImageElement>
function requestImage(url: string, scale: number | undefined, owner: ResourceScope): Promise<HTMLImageElement | undefined>
function requestImage(url: string, scale: number | undefined, owner: ResourceScope | undefined): Promise<HTMLImageElement | undefined> {
  return new Promise((resolve, reject) => {
    const request = owner ? owner.child() : new ResourceScope()
    let complete = false
    let releaseBlob = () => {}

    function fail(error: unknown): void {
      if (complete)
        return
      complete = true
      try {
        request.dispose()
      }
      catch (cleanupError) {
        console.warn('Additional image cleanup failure:', cleanupError)
      }
      try {
        releaseBlob()
      }
      catch (cleanupError) {
        console.warn('Additional image cleanup failure:', cleanupError)
      }
      reject(error)
    }

    function finish(image: HTMLImageElement): void {
      if (complete || request.closed)
        return
      complete = true
      try {
        request.dispose()
        resolve(image)
      }
      catch (error) {
        try {
          releaseBlob()
        }
        finally {
          reject(error)
        }
      }
    }

    request.add(() => {
      if (!complete) {
        complete = true
        try {
          releaseBlob()
        }
        finally {
          resolve(undefined)
        }
      }
    })
    if (request.closed)
      return

    function watch(image: HTMLImageElement, loaded: () => void): void {
      image.onload = () => {
        if (!complete && !request.closed) {
          try {
            loaded()
          }
          catch (error) {
            fail(error)
          }
        }
      }
      image.onerror = () => fail(new Error(`Image load failed: ${url}`))
      request.add(() => {
        image.onload = null
        image.onerror = null
        if (!complete)
          image.removeAttribute('src')
      })
    }

    try {
      const image = new Image()
      watch(image, () => {
        if (!scale || scale === 1) {
          finish(image)
          return
        }
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = image.width * scale
        canvas.height = image.height * scale
        if (!context)
          throw new TypeError('Canvas 2D context is unavailable')
        if (complete || request.closed)
          return
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        if (complete || request.closed)
          return
        canvas.toBlob((blob) => {
          if (complete || request.closed)
            return
          try {
            if (!blob)
              throw new Error('Unable to encode thumbnail image')
            const blobUrl = URL.createObjectURL(blob)
            let revoked = false
            const revoke = (): undefined => {
              if (!revoked) {
                revoked = true
                URL.revokeObjectURL(blobUrl)
              }
            }
            releaseBlob = owner ? owner.add(revoke) : revoke
            if (complete || request.closed) {
              releaseBlob()
              return
            }
            const scaled = new Image()
            watch(scaled, () => finish(scaled))
            if (!request.closed)
              scaled.src = blobUrl
          }
          catch (error) {
            fail(error)
          }
        })
      })
      if (!request.closed)
        image.src = url
    }
    catch (error) {
      fail(error)
    }
  })
}

// Public callers own a scaled result's image.src object URL.
export function loadImg(url: string, scale?: number): Promise<HTMLImageElement> {
  return requestImage(url, scale, undefined)
}

// Internal previews own their result until configuration replacement or destroy.
export function loadThumbnailImage(url: string, scale: number | undefined, owner: ResourceScope): Promise<HTMLImageElement | undefined> {
  return requestImage(url, scale, owner)
}
