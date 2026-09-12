import type { Packet, RequestHost } from './requests'
import { sessionMetadata, sessionType, withSession } from './protocol'
import { cancelRequests, captureRequests, setRequestBoundary } from './requests'

interface Navigation {
  source: string
  rawSource: string
  documentId?: string
  hasHandshake: boolean
  waiting: boolean
  observer?: MutationObserver
  cancelPrevious?: (reason: unknown) => void
}

const navigations = new WeakMap<RequestHost, Navigation>()
const withoutHash = (value: string) => value.split('#')[0]!
function sourceOf(host: RequestHost): string {
  const frame = host.$iframe
  return frame.hasAttribute?.('srcdoc') ? `srcdoc:${frame.getAttribute('srcdoc')}` : `src:${withoutHash(frame.src || '')}`
}

function rawSourceOf(host: RequestHost): string {
  const frame = host.$iframe
  return frame.hasAttribute?.('srcdoc') ? `srcdoc:${frame.getAttribute('srcdoc')}` : `src:${frame.getAttribute?.('src') ?? frame.src ?? ''}`
}

function invalidate(host: RequestHost, state: Navigation): void {
  if (!state.waiting) {
    if (state.documentId)
      state.cancelPrevious = captureRequests(host)
    else
      cancelRequests(host, new Error('The iframe document has changed'))
  }
  state.waiting = true
  host.injected = false
}

function leaveDocument(host: RequestHost, state: Navigation): void {
  if (state.cancelPrevious)
    state.cancelPrevious(new Error('The iframe document has changed'))
  else if (!state.waiting)
    cancelRequests(host, new Error('The iframe document has changed'))
  state.cancelPrevious = undefined
  state.waiting = true
  host.injected = false
}

function sourceChanged(host: RequestHost, state: Navigation, records: MutationRecord[]): boolean {
  if (sourceOf(host) !== state.source)
    return true
  if (!state.documentId)
    return false
  if (rawSourceOf(host) !== state.rawSource)
    return true
  return records.some((record) => {
    if (record.attributeName === 'srcdoc')
      return true
    if (record.attributeName !== 'src' || host.$iframe.hasAttribute?.('srcdoc'))
      return false
    return true
  })
}

function observeSource(host: RequestHost, state: Navigation, records: MutationRecord[]): void {
  const rawSource = rawSourceOf(host)
  if (!records.length && rawSource === state.rawSource)
    return
  const changed = sourceChanged(host, state, records)
  state.rawSource = rawSource
  state.source = sourceOf(host)
  if (changed)
    invalidate(host, state)
}

export function prepareNavigation(host: RequestHost): void {
  const state = navigations.get(host)
  if (!state || host.destroyed)
    return
  const records = state.observer?.takeRecords() || []
  observeSource(host, state, records)
}

export function createNavigation(host: RequestHost): { start: () => void, dispose: () => void } {
  const state: Navigation = { source: sourceOf(host), rawSource: rawSourceOf(host), hasHandshake: false, waiting: false }
  navigations.set(host, state)
  setRequestBoundary(host, {
    prepare: () => prepareNavigation(host),
    envelope: packet => state.documentId ? withSession(packet, state.documentId, 'message') : packet,
  })
  return {
    start() {
      if (typeof window.MutationObserver !== 'function')
        return
      state.observer = new window.MutationObserver((records) => {
        if (host.destroyed)
          return
        observeSource(host, state, records)
      })
      state.observer.observe(host.$iframe, { attributes: true, attributeOldValue: true, attributeFilter: ['src', 'srcdoc'] })
    },
    dispose() {
      navigations.delete(host)
      setRequestBoundary(host, undefined)
      state.cancelPrevious = undefined
      state.observer?.disconnect()
    },
  }
}

function activate(host: RequestHost, state: Navigation, documentId: string): void {
  if (state.hasHandshake && state.documentId !== documentId) {
    if (state.cancelPrevious)
      state.cancelPrevious(new Error('The iframe document has changed'))
    else if (!state.waiting)
      cancelRequests(host, new Error('The iframe document has changed'))
  }
  state.cancelPrevious = undefined
  state.documentId = documentId
  state.hasHandshake = true
  state.waiting = false
  host.injected = true
  try {
    host.$iframe.contentWindow?.postMessage(withSession({ type: sessionType, data: undefined, id: 0 }, documentId, 'ack'), '*')
  }
  catch {
    // A failed private acknowledgement does not replace the public inject callback.
  }
}

export function consumeNavigation(host: RequestHost, packet: Packet): boolean {
  const state = navigations.get(host)
  if (!state)
    return false
  prepareNavigation(host)
  const metadata = sessionMetadata(packet)
  if (metadata && packet.type === sessionType) {
    if (metadata.phase === 'resume') {
      activate(host, state, metadata.document)
    }
    else if (metadata.document === state.documentId) {
      if (metadata.phase === 'leave')
        leaveDocument(host, state)
      else if (metadata.phase === 'fragment' && state.cancelPrevious && !host.$iframe.hasAttribute?.('srcdoc') && packet.data === host.$iframe.src)
        activate(host, state, metadata.document)
    }
    return true
  }
  if (packet.type === 'inject') {
    if (metadata?.phase === 'inject') {
      if (state.waiting && metadata.document === state.documentId)
        return true
      activate(host, state, metadata.document)
    }
    else {
      if (state.waiting) {
        state.cancelPrevious?.(new Error('The iframe document has changed'))
        state.cancelPrevious = undefined
        state.documentId = undefined
      }
      state.hasHandshake = true
      state.waiting = false
    }
    return false
  }
  return Boolean(metadata && ((state.waiting && !state.cancelPrevious) || metadata.document !== state.documentId))
}
