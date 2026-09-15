import assert from 'node:assert/strict'
import vm from 'node:vm'

export interface TokenLine { line: string, tokens: { startIndex: number, type: string }[] }
export interface TokenFixture { source: string, language: string, languages: string[], cases: TokenLine[][] }

// Evaluate fixed upstream test definitions with a recording runner, including their
// generated cases and SCSS preprocessing. This VM is not a security sandbox.
export function extractBasicFixtures(ts: typeof import('typescript'), tests: string[], read: (file: string) => string): TokenFixture[] {
  const fixtures: TokenFixture[] = []
  const emit = (source: string) => ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5 },
  }).outputText
  let clojure: object | undefined
  for (const file of tests) {
    assert(/^monaco-languages\/src\/[^/]+\/[^/]+\.test\.ts$/.test(file), 'Unexpected test member')
    const language = file.split('/')[2]!
    vm.runInNewContext(emit(read(file)), {
      exports: {},
      require(name: string) {
        if (name === '../test/testRunner') {
          return {
            testTokenization(languages: string | string[], cases: TokenLine[][]) {
              fixtures.push(JSON.parse(JSON.stringify({ source: file, language, languages: typeof languages === 'string' ? [languages] : languages, cases })))
            },
          }
        }
        if (language === 'clojure' && name === './clojure') {
          if (!clojure) {
            clojure = {}
            vm.runInNewContext(emit(read('monaco-languages/src/clojure/clojure.ts')), { exports: clojure }, { timeout: 1000, contextCodeGeneration: { strings: false, wasm: false } })
          }
          return clojure
        }
        throw new Error(`Unexpected test import: ${name}`)
      },
    }, { timeout: 1000, contextCodeGeneration: { strings: false, wasm: false } })
  }
  return fixtures
}
