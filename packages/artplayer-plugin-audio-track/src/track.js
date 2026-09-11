export function createAudioTrack(option) {
  let { url, offset = 0, sync = 0.3 } = option
  const audio = new Audio()
  let closed = false

  function play() {
    if (closed || !url)
      return
    audio.play().catch((error) => {
      if (!closed)
        console.warn(error)
    })
  }

  function pause() {
    if (!closed)
      audio.pause()
  }

  function destroy() {
    if (closed)
      return
    closed = true
    const failures = []
    for (const release of [() => audio.pause(), () => audio.removeAttribute('src'), () => audio.load()]) {
      try {
        release()
      }
      catch (error) { failures.push(error) }
    }
    if (failures.length)
      throw failures[0]
  }

  try {
    audio.preload = 'auto'
    if (url)
      audio.src = url
  }
  catch (error) {
    try {
      destroy()
    }
    catch {}
    throw error
  }

  return {
    audio,
    play,
    pause,
    destroy,
    sync(time) {
      if (closed || !url)
        return
      const target = time + offset
      if (Math.abs(audio.currentTime - target) > sync)
        audio.currentTime = target
    },
    update(newOption, playing) {
      if (closed)
        return
      if (newOption.url && newOption.url !== url) {
        url = newOption.url
        audio.src = url
        if (playing)
          play()
      }
      if (newOption.offset !== undefined)
        offset = newOption.offset
      if (newOption.sync !== undefined)
        sync = newOption.sync
    },
  }
}
