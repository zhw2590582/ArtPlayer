import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import ts from 'typescript'
import { hash } from './provenance.ts'

export interface Revision {
  guid: string
  postId: number
  number: number
  created: number
  userId: number
  license: string
  bodySha256: string
  snippetSha256: string
}

export function revisionSnippet(response: Uint8Array, expected: Revision): string {
  const data = JSON.parse(Buffer.from(response).toString('utf8')) as { items: { revision_guid: string, post_id: number, revision_number: number, creation_date: number, user: { user_id: number }, content_license: string, body: string }[] }
  assert.equal(data.items.length, 1, 'Expected one fixed answer revision')
  const item = data.items[0]!
  assert.deepEqual([item.revision_guid, item.post_id, item.revision_number, item.creation_date, item.user.user_id, item.content_license], [expected.guid, expected.postId, expected.number, expected.created, expected.userId, expected.license], 'Answer revision identity changed')
  assert.equal(hash(item.body), expected.bodySha256, 'Answer revision body changed')
  const blocks = [...item.body.matchAll(/<pre><code>([\s\S]*?)<\/code><\/pre>/g)]
  assert.equal(blocks.length, 1, 'Expected one answer code block')
  const snippet = blocks[0]![1]!.replaceAll('&amp;', '&')
  assert.equal(hash(snippet), expected.snippetSha256, 'Answer snippet changed')
  return snippet
}

export function moduleStatement(source: string, name: string): string {
  const file = ts.createSourceFile('source.js', source, ts.ScriptTarget.Latest, true)
  const matches = file.statements.filter(statement => ts.isVariableStatement(statement) && statement.declarationList.declarations.some(declaration => ts.isIdentifier(declaration.name) && declaration.name.text === name))
  assert.equal(matches.length, 1, 'Expected one module declaration')
  return matches[0]!.getText(file)
}
