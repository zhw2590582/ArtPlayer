export const def = Object.defineProperty

const { hasOwnProperty } = Object.prototype
export function has(obj: object, name: PropertyKey): boolean {
  return hasOwnProperty.call(obj, name)
}

export function get(obj: object, name: PropertyKey): PropertyDescriptor | undefined {
  return Object.getOwnPropertyDescriptor(obj, name)
}

export function mergeDeep<T extends object[]>(...objects: T): T[number] {
  const isObject = (item: unknown): item is Record<string, unknown> => !!item && typeof item === 'object' && !Array.isArray(item)
  const result = objects.reduce<Record<string, unknown>>((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key]
      const oVal: unknown = (obj as Record<string, unknown>)[key]
      let value: unknown
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        value = pVal.concat(...oVal)
      }
      else if (isObject(pVal) && isObject(oVal)) {
        value = mergeDeep(pVal, oVal)
      }
      else {
        value = oVal
      }
      // Treat keys as data rather than invoking inherited setters such as __proto__.
      def(prev, key, { value, enumerable: true, configurable: true, writable: true })
    })
    return prev
  }, {})
  // Preserve the existing generic API; dynamic keys are handled only inside this boundary.
  return result as T[number]
}
