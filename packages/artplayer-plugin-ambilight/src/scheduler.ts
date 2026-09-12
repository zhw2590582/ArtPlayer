export function createFrameLoop(frequency: number, playing: () => boolean, update: (active: () => boolean) => void) {
  let state: 'stopped' | 'running' | 'destroyed' = 'stopped'
  let pending: number | null = null
  let generation = 0
  let inFrame = false
  let lastUpdateTime = 0

  function schedule() {
    const current = generation
    try {
      pending = requestAnimationFrame(() => {
        if (state !== 'running' || current !== generation)
          return
        pending = null
        tick()
      })
    }
    catch (error) {
      state = 'stopped'
      generation++
      throw error
    }
  }

  function tick() {
    const current = generation
    const active = () => state === 'running' && current === generation
    inFrame = true
    try {
      const now = performance.now()
      if (now - lastUpdateTime < 1000 / frequency || !playing() || !active())
        return
      lastUpdateTime = now
      update(active)
    }
    finally {
      inFrame = false
      if (state === 'running' && pending === null)
        schedule()
    }
  }

  function start() {
    if (state !== 'stopped')
      return
    state = 'running'
    generation++
    if (!inFrame)
      tick()
  }

  function stop() {
    if (state === 'destroyed')
      return
    state = 'stopped'
    generation++
    const frame = pending
    pending = null
    if (frame !== null)
      cancelAnimationFrame(frame)
  }

  function destroy() {
    if (state === 'destroyed')
      return
    state = 'destroyed'
    generation++
    const frame = pending
    pending = null
    if (frame !== null)
      cancelAnimationFrame(frame)
  }
  return { start, stop, destroy }
}
