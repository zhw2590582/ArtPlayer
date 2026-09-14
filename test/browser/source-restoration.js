export async function switchAfterNativeRestoration(page, url) {
  await page.evaluate((url) => {
    const art = window.art
    if (url === art.url)
      return art.switchUrl(url)
    const video = art.video
    let resolveRestored
    const restored = new Promise((resolve) => {
      resolveRestored = resolve
    })
    const onSeeked = () => resolveRestored()
    const onMetadata = () => {
      if (video.seeking)
        video.addEventListener('seeked', onSeeked, { once: true })
      else
        resolveRestored()
    }
    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onMetadata)
      video.removeEventListener('seeked', onSeeked)
    }
    video.addEventListener('loadedmetadata', onMetadata, { once: true })
    try {
      return Promise.all([art.switchUrl(url), restored]).then(() => undefined).finally(cleanup)
    }
    catch (error) {
      cleanup()
      throw error
    }
  }, url)
}
