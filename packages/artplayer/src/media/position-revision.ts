const revisions = new WeakMap<object, number>()

export function positionRevision(art: object): number {
  return revisions.get(art) || 0
}

export function advancePosition(art: object): void {
  revisions.set(art, positionRevision(art) + 1)
}
