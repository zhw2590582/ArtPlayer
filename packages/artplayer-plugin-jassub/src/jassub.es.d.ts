import type { RuntimeInstance, RuntimeOption } from '../types/runtime-api.js'

interface VendorInstance extends RuntimeInstance {
  _destroyed?: boolean
  // Minimal write contract: the DOM setter coerces the historical numeric 20.
  _canvasParent?: { style: { zIndex: string | number } }
}

declare const JASSUB: {
  new (option: RuntimeOption): VendorInstance
}
export default JASSUB
