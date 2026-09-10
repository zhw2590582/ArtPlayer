import { isClosing } from '../lifecycle/instance'
import { errorHandle } from '../utils/error'
import { def, has } from '../utils/property'

export default function registerPlugin<Registry extends { art: object, id: number }>(registry: Registry, plugin: { name: string }, result: unknown): Registry {
  if (isClosing(registry.art))
    return registry
  // Keep the historical duck-typed name lookup and native property-key coercion.
  const name = (result && (result as { name?: unknown }).name) || plugin.name || `plugin${registry.id}`
  if (isClosing(registry.art))
    return registry
  let key = name as PropertyKey
  const duplicate = has(registry, key)
  if (isClosing(registry.art))
    return registry
  const message = `Cannot add a plugin that already has the same name: ${name}`
  if (isClosing(registry.art))
    return registry
  errorHandle(!duplicate, message)
  // Object keys can execute user code during native coercion. Keep that third
  // coercion in its historical position, then check closure before defining.
  if ((typeof name === 'object' && name !== null) || typeof name === 'function')
    key = Reflect.ownKeys({ [key]: undefined })[0]!
  if (!isClosing(registry.art))
    def(registry, key, { value: result })
  return registry
}
