import type { RuntimeOption } from '../types/runtime-api.js'
import type { JassubHost } from './registration.js'
import { registerJassub } from './registration.js'

export default function artplayerPluginJassub(option?: RuntimeOption) {
  return (art: JassubHost) => registerJassub(art, option)
}
