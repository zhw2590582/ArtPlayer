import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import prompts from 'prompts'

export function getProjects(root = process.cwd()) {
  const packages = path.join(root, 'packages')
  return Object.fromEntries(fs.readdirSync(packages).sort()
    .filter(name => name !== 'artplayer-vitepress' && fs.existsSync(path.join(packages, name, 'package.json')))
    .map(name => [name, path.join(packages, name)]))
}

export function getEntryFile(projectDir) {
  const entries = ['index.js', 'index.ts'].map(name => path.join(projectDir, 'src', name)).filter(file => fs.existsSync(file) && fs.statSync(file).isFile())
  if (entries.length !== 1)
    throw new Error(`${path.basename(projectDir)} must have exactly one src/index.js or src/index.ts; found ${entries.length}`)
  return entries[0]
}

export function parseProjects(args, projects, command) {
  const names = []
  let open = true
  let analyze = false
  for (const arg of args) {
    if (arg === '--no-open' && command === 'dev')
      open = false
    else if (arg === '--analyze' && command === 'build')
      analyze = true
    else if (arg === '--help')
      return { help: true, names: [], open }
    else if (arg !== '--')
      names.push(arg)
  }
  if (names.includes('all')) {
    if (command !== 'build' || names.length !== 1)
      throw new Error('Use build all on its own; dev accepts one package')
    return { names: Object.keys(projects), open, analyze }
  }
  for (const name of names) {
    if (!Object.hasOwn(projects, name))
      throw new Error(`Unknown package: ${name}. Use yarn ${command} --help`)
  }
  if (command === 'dev' && names.length > 1)
    throw new Error('dev accepts one package')
  return { names: [...new Set(names)], open, analyze }
}

export async function selectProjects(projects, command) {
  const selection = parseProjects(process.argv.slice(2), projects, command)
  if (selection.help) {
    console.log(command === 'build' ? 'Usage: yarn build [all | package ...] [--analyze]' : 'Usage: yarn dev [package] [--no-open]')
    return selection
  }
  if (!selection.names.length) {
    if (!process.stdin.isTTY)
      throw new Error(`Select a package explicitly in non-interactive mode: yarn ${command} artplayer`)
    const { value } = await prompts({
      type: 'select',
      name: 'value',
      message: `Which project do you want to ${command === 'build' ? 'build' : 'develop'}?`,
      choices: Object.keys(projects).map(name => ({ title: name, value: name })),
    })
    selection.names = value ? [value] : []
  }
  for (const name of selection.names)
    getEntryFile(projects[name])
  return selection
}
