export function toPascalCase(name: string): string {
  return name.replace(/(^|-)([a-z])/g, (_, _prefix: string, letter: string) => letter.toUpperCase())
}

export function toCamelCase(name: string): string {
  return name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

export function getGlobalName(name: string): string {
  return name === 'artplayer' || name.startsWith('artplayer-tool-') ? toPascalCase(name) : toCamelCase(name)
}
