export interface Placement {
  node: Node
  parent: ParentNode | null
  next: ChildNode | null
}

export function capturePlacement(node: Node): Placement {
  return { node, parent: node.parentNode, next: node.nextSibling }
}

export function restorePlacement({ node, parent, next }: Placement): void {
  if (!parent) {
    node.parentNode?.removeChild(node)
    return
  }
  const anchor = next?.parentNode === parent ? next : null
  if (node.parentNode !== parent || node.nextSibling !== anchor)
    parent.insertBefore(node, anchor)
}
