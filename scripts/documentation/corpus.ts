import assert from 'node:assert/strict'
import { globSync } from 'glob'
import ts from 'typescript'
import { ownedPath, read, sha256 } from './files.ts'

export function buildCorpus(root: string): Map<string, string> {
  const common = ts.createSourceFile(
    'editor-libraries.ts',
    read(ownedPath(root, 'packages/artplayer-vitepress/browser/editor-libraries.ts')),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const declarations: string[] = []
  let lists = 0
  function visit(node: ts.Node): void {
    if (
      ts.isVariableDeclaration(node)
      && ts.isIdentifier(node.name)
      && node.name.text === 'libUris'
    ) {
      lists++
      assert(
        node.initializer && ts.isArrayLiteralExpression(node.initializer),
        'Expected literal editor library list',
      )
      for (const element of node.initializer.elements) {
        assert(
          ts.isStringLiteral(element)
          && /^\.\/assets\/ts\/[\w.-]+\.d\.ts$/.test(element.text),
          'Unexpected editor library path',
        )
        declarations.push(`docs/${element.text.slice(2)}`)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(common)
  assert(
    lists === 1
    && declarations.length
    && new Set(declarations).size === declarations.length,
    'Missing or duplicate editor library list',
  )
  const sections = [
    {
      title: 'Documentation Summary',
      files: globSync('packages/artplayer-vitepress/docs/en/**/*.md', {
        cwd: root,
        posix: true,
      }).sort(),
    },
    { title: 'Type Definitions Overview', files: declarations },
    {
      title: 'Examples Summary',
      files: globSync('docs/assets/example/*.js', {
        cwd: root,
        posix: true,
      }).sort(),
    },
    {
      title: 'Third-party Type Notices',
      files: ['docs/assets/ts/artplayer-plugin-vast.LICENSE.txt'],
    },
  ]
  const sources: { file: string, sha256Lf: string }[] = []
  let text
    = 'ArtPlayer documentation source bundle\nGenerated offline by yarn build:llm. Source text is preserved after LF normalization.\nThese are source references, not proof that every example or documented feature has passed release review.\n'
  for (const section of sections) {
    assert(
      section.files.length,
      `Empty documentation section: ${section.title}`,
    )
    text += `\n===== ${section.title} =====\n`
    for (const file of section.files) {
      const content = read(ownedPath(root, file))
      sources.push({ file, sha256Lf: sha256(content) })
      text += `\n===== ${file} =====\n\n${content}\n`
    }
  }
  return new Map([
    ['docs/llms.txt', text],
    [
      'docs/llms.manifest.json',
      `${JSON.stringify({ schemaVersion: 1, generation: 'offline-source-preserving', sources, outputSha256Lf: sha256(text) }, null, 2)}\n`,
    ],
  ])
}
