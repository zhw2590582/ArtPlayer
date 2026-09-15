import path from 'node:path'

// Require a live, unchanged runner and a complete creation-ordered ancestry chain.
export function selectFirefoxProcesses(rows, root, executable) {
  const samePath = value => typeof value === 'string' && path.win32.normalize(value).toLowerCase() === path.win32.normalize(executable).toLowerCase()
  const byId = new Map(rows.map(row => [row.pid, row]))
  const currentRoot = byId.get(root.pid)
  if (!currentRoot || !Number.isFinite(Date.parse(root.created)) || currentRoot.created !== root.created || currentRoot.executable !== root.executable)
    return []
  return rows.filter((row) => {
    if (row.pid === root.pid || !samePath(row.executable))
      return false
    const seen = new Set([row.pid])
    let child = row
    while (child.parent !== root.pid) {
      const parent = byId.get(child.parent)
      if (!parent || seen.has(parent.pid) || !samePath(parent.executable) || !Number.isFinite(Date.parse(parent.created)) || Date.parse(parent.created) > Date.parse(child.created))
        return false
      seen.add(parent.pid)
      child = parent
    }
    return Number.isFinite(Date.parse(row.created)) && Number.isFinite(Date.parse(child.created))
      && Date.parse(child.created) >= Date.parse(root.created)
  })
}
