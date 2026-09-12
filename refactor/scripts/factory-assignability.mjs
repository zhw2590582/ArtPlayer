import assert from 'node:assert/strict'
import path from 'node:path'
import ts from 'typescript'
import compat from 'typescript-compat'
import { verifyAmbilightContract } from './ambilight-contract.mjs'
import { verifyCanvasContract } from './canvas-contract.mjs'
import { readMember } from './releases.mjs'

export const packages = [
  { name: 'artplayer-proxy-canvas', verify: verifyCanvasContract, optional: true, option: '(ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void', value: '(_ctx: CanvasRenderingContext2D, _video: HTMLVideoElement) => {}', result: 'HTMLCanvasElement', replacement: 'document.createElement(\'canvas\')' },
  { name: 'artplayer-plugin-ambilight', verify: verifyAmbilightContract, optional: false, option: '{ blur?: string; opacity?: number; frequency?: number; zIndex?: number; duration?: number }', value: '{ blur: \'50px\', opacity: 0.5, frequency: 10, zIndex: 9, duration: 0.3 }', result: '{ name: \'artplayerPluginAmbilight\'; start: () => void; stop: () => void }', replacement: '({ name: \'artplayerPluginAmbilight\' as const, start() {}, stop() {} })' },
]

export function declaration(pkg, shape) {
  const head = `import type Artplayer from 'artplayer';
type Option = ${pkg.option};
type Result = ${pkg.result};
type Callable = (option${pkg.optional ? '?' : ''}: Option) => (art: Artplayer) => Result;
`
  if (shape === 'latest-default')
    return `${head}declare const plugin: Callable; export default plugin;`
  if (shape === 'callable-export-equals')
    return `${head}declare const plugin: Callable; export = plugin;`
  assert(['required-default', 'optional-default'].includes(shape))
  return `${head}interface Factory extends Callable { readonly default${shape === 'optional-default' ? '?' : ''}: Factory }
declare const plugin: Factory; export = plugin;`
}

export function consumer(pkg, usage) {
  const head = `import Artplayer from 'artplayer';`
  if (usage === 'factory-replacement') {
    return `${head}import plugin from './factory-history';
const replacement: typeof plugin = (_option${pkg.optional ? '?' : ''}: Parameters<typeof plugin>[0]) => (_art: Artplayer) => ${pkg.replacement};
void replacement;`
  }
  assert(['require-call', 'require-default'].includes(usage))
  return `${head}import plugin = require('./factory-history'); plugin${usage === 'require-default' ? '.default' : ''}(${pkg.value});`
}

export function diagnostics(compiler, source, types) {
  const filename = path.resolve('test/types/factory-history-consumer.ts')
  const typefile = path.resolve('test/types/factory-history.d.ts')
  const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] }
  const host = compiler.createCompilerHost(options)
  const original = host.getSourceFile.bind(host)
  host.getSourceFile = (file, language, ...rest) => path.resolve(file) === filename
    ? compiler.createSourceFile(file, source, language, true)
    : path.resolve(file) === typefile ? compiler.createSourceFile(file, types, language, true) : original(file, language, ...rest)
  const exists = host.fileExists.bind(host)
  host.fileExists = file => path.resolve(file) === typefile || exists(file)
  const program = compiler.createProgram([filename, typefile], options, host)
  assert(program.getSourceFile(typefile))
  return compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n') }))
}

export async function evaluateFactoryProposals() {
  const records = []
  for (const pkg of packages) {
    const contract = await pkg.verify()
    const shapes = new Map(['1.0.0', '1.1.0'].map(version => [
      `published-${version}`,
      readMember(contract.archives.get(version), `package/types/${pkg.name}.d.ts`).toString(),
    ]))
    for (const shape of ['required-default', 'optional-default', 'latest-default', 'callable-export-equals'])
      shapes.set(shape, declaration(pkg, shape))
    for (const compiler of [ts, compat]) {
      for (const [shape, types] of shapes) {
        for (const usage of ['factory-replacement', 'require-call', 'require-default']) {
          records.push({ name: pkg.name, compiler: compiler.version, shape, usage, diagnostics: diagnostics(compiler, consumer(pkg, usage), types) })
        }
      }
    }
  }
  return records
}
