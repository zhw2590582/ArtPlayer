const handled = new WeakSet<KeyboardEvent>()

export function claimKey(event: KeyboardEvent): void {
  handled.add(event)
  event.preventDefault()
}

export function isClaimedKey(event: KeyboardEvent): boolean {
  return handled.has(event)
}

export function plainKey(event: KeyboardEvent): boolean {
  return !event.altKey && !event.ctrlKey && !event.metaKey && !event.isComposing && event.keyCode !== 229
}
