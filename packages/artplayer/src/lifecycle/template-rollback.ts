interface Snapshot {
  node: Node
  children: Node[]
  attributes?: [string, string][]
  value: string | null
}

export default function captureTemplate(container: Element): () => void {
  const snapshots: Snapshot[] = []
  function capture(node: Node) {
    const children = Array.from(node.childNodes)
    snapshots.push({
      node,
      children,
      attributes: node.nodeType === 1 ? Array.from((node as Element).attributes, attr => [attr.name, attr.value]) : undefined,
      value: node.nodeValue,
    })
    children.forEach(capture)
  }
  capture(container)
  return () => {
    for (const { node, children, attributes, value } of snapshots) {
      while (node.firstChild)
        node.removeChild(node.firstChild)
      for (const child of children)
        node.appendChild(child)
      if (attributes) {
        const element = node as Element
        for (const attr of Array.from(element.attributes))
          element.removeAttribute(attr.name)
        for (const [name, content] of attributes)
          element.setAttribute(name, content)
      }
      else {
        node.nodeValue = value
      }
    }
  }
}
