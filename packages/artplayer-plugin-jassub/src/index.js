import { registerJassub } from './registration.js'

export default function artplayerPluginJassub(option) {
  return art => registerJassub(art, option)
}
