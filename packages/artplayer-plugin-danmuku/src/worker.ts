import type { PlacementMessage, PlacementReply } from './worker-types'
import { getDanmuTop } from './placement'

onmessage = (event: MessageEvent<PlacementMessage>) => {
  const { data } = event
  if (!data.id || !data.type)
    return

  const fns = { getDanmuTop }
  const fn = fns[data.type]
  const result = fn(data)

  globalThis.postMessage({
    result,
    id: data.id,
  } satisfies PlacementReply)
}
