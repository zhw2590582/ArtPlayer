export function errorArgument(value: unknown): unknown {
  try {
    if (Object.prototype.toString.call(value) !== '[object Error]')
      return value
    const error = value as Error
    const stack = error.stack
    const message = error.message
    if (typeof stack !== 'string' || !message)
      return value
    const header = error.name ? `${error.name}: ${message}` : message
    return stack.startsWith(header) ? value : `${header}\n${stack}`
  }
  catch {
    // Keep the legacy parser's behavior for unusual throwing Error getters.
    return value
  }
}
