import type { NativeFullscreenAdapter } from './types'

const abandoned = new WeakMap<Document, WeakMap<Element, () => unknown>>()

export function hasAbandonedFullscreen(adapter: NativeFullscreenAdapter): boolean {
  return abandoned.get(adapter.document)?.has(adapter.target) ?? false
}

export function clearAbandonedFullscreen(adapter: NativeFullscreenAdapter): void {
  abandoned.get(adapter.document)?.delete(adapter.target)
}

function exitNative(exit: () => unknown): void {
  try {
    void Promise.resolve(exit()).catch(() => {})
  }
  catch {}
}

function entriesFor(document: Document, elementProperty: string, changeEvent: string): WeakMap<Element, () => unknown> {
  let entries = abandoned.get(document)
  if (!entries) {
    entries = new WeakMap()
    abandoned.set(document, entries)
    const pending = entries
    // A document-lifetime guard for unabortable void APIs. Keys are weak and values
    // contain only the native exit operation, never an ArtPlayer instance or scope.
    document.addEventListener(changeEvent, () => {
      const element = Reflect.get(document, elementProperty) as Element | null
      const release = element && pending.get(element)
      if (!release)
        return
      pending.delete(element)
      exitNative(release)
    })
  }
  return entries
}

export function abandonFullscreen(adapter: NativeFullscreenAdapter): void {
  const { document, elementProperty, changeEvent, target, exit } = adapter
  const entries = entriesFor(document, elementProperty, changeEvent)
  entries.set(target, exit)
  if (adapter.element === target) {
    entries.delete(target)
    exitNative(exit)
  }
}
