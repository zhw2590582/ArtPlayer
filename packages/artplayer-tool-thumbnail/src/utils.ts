export function getFileName(name: string) {
  const nameArray = name.split('.')
  nameArray.pop()
  return nameArray.join('.')
}

export function clamp(num: number, a: number, b: number) {
  return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b))
}
