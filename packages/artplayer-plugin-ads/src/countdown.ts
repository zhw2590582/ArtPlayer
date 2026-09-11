import type { Cleanup } from './types'

export function createCountdown(total: () => number, render: (seconds: number) => void, complete: Cleanup) {
  let elapsed = 0
  let ready = false
  let running = false
  let closed = false
  let timer: ReturnType<typeof setTimeout> | undefined

  function schedule(): void {
    if (!ready || !running || closed || timer !== undefined)
      return
    timer = setTimeout(() => {
      timer = undefined
      if (closed || !running)
        return
      elapsed += 1
      render(elapsed)
      if (closed)
        return
      if (elapsed >= total())
        complete()
      else
        schedule()
    }, 1000)
  }

  function pause(): void {
    running = false
    if (timer !== undefined)
      clearTimeout(timer)
    timer = undefined
  }

  return {
    start() {
      if (ready || closed)
        return
      ready = true
      running = true
      schedule()
    },
    play() {
      if (!ready || closed)
        return
      running = true
      schedule()
    },
    pause,
    stop() {
      closed = true
      pause()
    },
  }
}
