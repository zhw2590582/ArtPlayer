import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateDtsBundle } from 'dts-bundle-generator'
import ts from 'typescript'
import { parseDeclaration } from './syntax.ts'

export function vastSdkDeclarations(): ts.Statement[] {
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const [code] = generateDtsBundle([{
    filePath: path.join(root, 'scripts/editor-declarations/vast-sdk.ts'),
    libraries: { inlinedLibraries: ['@glomex/vast-ima-player', '@alugha/ima'], allowedTypesLibraries: [] },
    output: { noBanner: true, exportReferencedTypes: false },
  }], { preferredConfigPath: path.join(root, 'scripts/tsconfig.editor.json') })
  assert(code, 'SDK bundle is empty')
  return [...parseDeclaration(code, 'vast-sdk.d.ts').statements].filter((node) => {
    if (!ts.isExportDeclaration(node))
      return true
    assert(!node.moduleSpecifier && node.exportClause && ts.isNamedExports(node.exportClause)
      && node.exportClause.elements.length === 0, 'Unexpected SDK re-export')
    return false
  })
}
