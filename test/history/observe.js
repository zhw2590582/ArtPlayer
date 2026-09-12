window.documentWitness = Math.random().toString(36)
window.lifecycle = []
window.fixtureErrors = []
for (const name of ['pageshow', 'pagehide']) {
  addEventListener(name, event => window.lifecycle.push({ type: event.type, persisted: event.persisted }))
}
addEventListener('error', event => window.fixtureErrors.push(event.message))
addEventListener('unhandledrejection', event => window.fixtureErrors.push(String(event.reason)))
addEventListener('message', (event) => {
  if (window === window.parent || event.source !== window.parent)
    return
  if (event.data?.type === 'history-fixture-finish') {
    window.parent.postMessage({ type: 'history-fixture-old-document', data: { witness: window.documentWitness, executions: window.executions || 0 } }, '*')
    window.finishHeld()
  }
})
