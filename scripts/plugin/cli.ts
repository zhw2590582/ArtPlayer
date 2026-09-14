import { publishPlugin } from './publish.ts'
import { renderPlugin } from './render.ts'

export function createPlugin(root: string, args: string[]): void {
  if (args.length === 1 && args[0] === '--help') {
    console.log('Usage: yarn create:plugin <lowercase-plugin-name>')
    return
  }
  if (args.length !== 1 || !args[0])
    throw new Error('Provide exactly one plugin name. Use yarn create:plugin --help')
  const name = args[0]
  publishPlugin(root, name, renderPlugin(name))
  console.log(`Created artplayer-plugin-${name} and example ${name.replaceAll('-', '.')}.js`)
  console.log(`Next: yarn build artplayer-plugin-${name}; yarn workspace artplayer-plugin-${name} test`)
  console.log('Register the new workspace/demo in the refactor inventories and update the root Yarn lock before CI.')
}
