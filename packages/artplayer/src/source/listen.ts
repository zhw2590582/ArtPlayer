import type ResourceScope from '../lifecycle/scope'
import type { SourceEvent, SourceEvents, SourceListener } from './types'

export function listenSource(scope: ResourceScope, art: SourceEvents, name: SourceEvent, callback: SourceListener, once = true): SourceListener {
  let fired = false
  let release: () => void
  const guarded: SourceListener = (event) => {
    if (scope.closed || fired)
      return
    if (once) {
      fired = true
      release()
    }
    callback(event)
  }
  art[once ? 'once' : 'on'](name, guarded)
  release = scope.add(() => {
    art.off(name, guarded)
  })
  return guarded
}
