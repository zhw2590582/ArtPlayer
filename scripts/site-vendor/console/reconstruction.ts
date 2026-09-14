import type { Source } from './provenance.ts'
import assert from 'node:assert/strict'

export interface EsmSource extends Source {
  archive: string
  stages: string[][]
  environment: Record<string, string | null>
  prefix: string
}
export interface BabelRuntime {
  version: string
  transform: (source: string, options: { plugins: string[] }) => { code: string }
}

export function reconstructModule(source: string, item: EsmSource, babel: BabelRuntime, minify: (source: string) => string) {
  for (const plugins of item.stages) {
    assert(plugins.length && plugins.every(name => ['transform-typeof-symbol', 'transform-modules-commonjs'].includes(name)), 'Unexpected historical transform')
    source = babel.transform(source, { plugins }).code
  }
  for (const [name, value] of Object.entries(item.environment)) {
    assert(['NODE_ENV', 'REACT_APP_SC_ATTR', 'SC_ATTR', 'REACT_APP_SC_DISABLE_SPEEDY', 'SC_DISABLE_SPEEDY'].includes(name), 'Unexpected historical environment key')
    source = source.replaceAll(`process.env.${name}`, value === null ? 'undefined' : JSON.stringify(value))
  }
  assert(['', 'var define;\n', 'var process = require("process");\n'].includes(item.prefix), 'Unexpected Parcel global injection')
  // Parcel generate() adds globals for minification and again for final output.
  return item.prefix + minify(item.prefix + source)
}

export function verifyPrelude(bundle: string, prelude: string, footer: string) {
  const prefix = prelude.trim().replace(/;$/, '')
  assert(bundle.startsWith(`${prefix}({`), 'Parcel prelude differs')
  assert(bundle.endsWith(footer), 'Parcel invocation or map trailer differs')
}
