export function releaseAll(actions: (() => void)[]): void {
  const failures: unknown[] = []
  for (const action of actions) {
    try {
      action()
    }
    catch (error) { failures.push(error) }
  }
  if (failures.length)
    throw failures[0]
}
