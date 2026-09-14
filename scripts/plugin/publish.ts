import fs from 'node:fs'
import path from 'node:path'

function checkedPath(root: string, relative: string): string {
  const target = path.resolve(root, relative)
  const within = path.relative(root, target)
  if (!within || within.startsWith('..') || path.isAbsolute(within))
    throw new Error(`Output escapes the repository: ${relative}`)
  let current = root
  for (const part of within.split(path.sep)) {
    current = path.join(current, part)
    try {
      if (fs.lstatSync(current).isSymbolicLink())
        throw new Error(`Refusing redirected output: ${current}`)
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT')
        throw error
    }
  }
  return target
}

function removeStage(stage: string, packages: string): void {
  if (fs.realpathSync(stage) !== stage || path.dirname(stage) !== packages || !path.basename(stage).startsWith('.artplayer-scaffold-'))
    throw new Error(`Refusing redirected scaffold cleanup: ${stage}`)
  fs.rmSync(stage, { recursive: true, force: true })
}

export function publishPlugin(root: string, name: string, files: ReadonlyMap<string, string>, link: typeof fs.linkSync = fs.linkSync): void {
  root = fs.realpathSync(root)
  const packages = checkedPath(root, 'packages')
  if (!fs.statSync(packages).isDirectory())
    throw new Error('The repository packages directory is missing')
  const destination = checkedPath(root, `packages/artplayer-plugin-${name}`)
  if (fs.existsSync(destination))
    throw new Error(`Plugin ${name} already exists`)
  for (const relative of files.keys()) {
    if (fs.existsSync(checkedPath(root, relative)))
      throw new Error(`Refusing to overwrite existing output: ${relative}`)
  }
  const stage = fs.mkdtempSync(path.join(packages, '.artplayer-scaffold-'))
  const createdDirectories: string[] = []
  const createdFiles: { target: string, content: string }[] = []
  function directory(target: string) {
    if (fs.existsSync(target))
      return
    directory(path.dirname(target))
    fs.mkdirSync(target)
    createdDirectories.push(target)
  }
  try {
    let index = 0
    for (const content of files.values())
      fs.writeFileSync(path.join(stage, String(index++)), content, { flag: 'wx' })
    // Reserve the package name without replacing even an empty concurrently-created directory.
    fs.mkdirSync(destination)
    createdDirectories.push(destination)
    index = 0
    for (const [relative, content] of files) {
      const target = checkedPath(root, relative)
      directory(path.dirname(target))
      link(path.join(stage, String(index++)), target)
      createdFiles.push({ target, content })
    }
  }
  catch (error) {
    const retained: string[] = []
    for (const { target, content } of createdFiles.reverse()) {
      try {
        if (fs.lstatSync(target).isSymbolicLink() || fs.readFileSync(target, 'utf8') !== content)
          retained.push(target)
        else fs.unlinkSync(target)
      }
      catch (failure) {
        if ((failure as NodeJS.ErrnoException).code !== 'ENOENT')
          retained.push(target)
      }
    }
    for (const directory of createdDirectories.reverse()) {
      try {
        fs.rmdirSync(directory)
      }
      catch (failure) {
        if ((failure as NodeJS.ErrnoException).code !== 'ENOENT')
          retained.push(directory)
      }
    }
    if (retained.length)
      throw new Error(`Scaffolding failed; preserve changed outputs for recovery: ${retained.join(', ')}`, { cause: error })
    throw error
  }
  finally {
    removeStage(stage, packages)
  }
}
