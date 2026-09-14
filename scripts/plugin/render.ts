import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function renderPlugin(name: string, template = fileURLToPath(new URL('./template', import.meta.url))): Map<string, string> {
  if (!/^[a-z]+(?:-[a-z]+)*$/.test(name))
    throw new Error('Use lowercase words separated by single hyphens for the plugin name')
  const replacements: Record<string, string> = {
    name,
    export: `artplayerPlugin${name.split('-').map(word => word[0]!.toUpperCase() + word.slice(1)).join('')}`,
    example: name.replaceAll('-', '.'),
  }
  const replace = (text: string) => text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!Object.hasOwn(replacements, key))
      throw new Error(`Unknown template placeholder: ${key}`)
    return replacements[key]!
  })
  const files = new Map<string, string>()
  function visit(directory: string, relative = '') {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const source = path.join(directory, entry.name)
      const target = path.posix.join(relative, entry.name)
      if (entry.isSymbolicLink())
        throw new Error(`Template links are not supported: ${source}`)
      if (entry.isDirectory()) {
        visit(source, target)
      }
      else if (entry.isFile()) {
        const output = `packages/artplayer-plugin-${name}/${replace(target).replace(/\.tpl$/, '')}`
        if (files.has(output))
          throw new Error(`Duplicate template output: ${output}`)
        files.set(output, replace(fs.readFileSync(source, 'utf8')).replaceAll('\r\n', '\n'))
      }
      else {
        throw new Error(`Unsupported template entry: ${source}`)
      }
    }
  }
  visit(template)
  files.set(`docs/assets/example/${replacements.example}.js`, `// npm i artplayer-plugin-${name}
// import ${replacements.export} from 'artplayer-plugin-${name}';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [${replacements.export}({})],
});
`)
  return files
}
