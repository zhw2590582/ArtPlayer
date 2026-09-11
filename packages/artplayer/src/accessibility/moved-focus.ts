/** Restore the same focused descendant after DOM reparenting. */
export function captureMovedFocus(root: HTMLElement): () => void {
  const focused = root.ownerDocument?.activeElement as HTMLElement | null | undefined
  const inside = focused && root.contains(focused)
  return () => {
    if (inside && focused.isConnected && root.contains(focused) && focused.ownerDocument.activeElement === focused.ownerDocument.body)
      focused.focus({ preventScroll: true })
  }
}
