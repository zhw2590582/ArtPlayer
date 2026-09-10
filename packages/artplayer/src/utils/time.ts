export function sleep(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<Receiver, Args extends unknown[]>(func: (this: Receiver, ...args: Args) => unknown, duration: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return function (this: Receiver, ...args: Args): void {
    const effect = () => {
      timeout = undefined
      return func.apply(this, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(effect, duration)
  }
}

export function throttle<Receiver, Args extends unknown[]>(func: (this: Receiver, ...args: Args) => unknown, duration: number) {
  let shouldWait = false

  return function (this: Receiver, ...args: Args): void {
    if (!shouldWait) {
      func.apply(this, args)
      shouldWait = true

      setTimeout(() => {
        shouldWait = false
      }, duration)
    }
  }
}
