import assert from 'node:assert/strict'
import vm from 'node:vm'
import ts from 'typescript'

export interface UnicodeTables { rtl: string, emoji: string, imprecise: string, grapheme: number[] }
export interface UnicodeOutput { logs: string[], writes: Map<string, string> }

function expressionText(expression: ts.Expression, file: ts.SourceFile): string {
  while (ts.isParenthesizedExpression(expression))
    expression = expression.expression
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.Standard, expression.getText(file))
  const tokens: string[] = []
  while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken)
    tokens.push(scanner.getTokenText())
  return tokens.join(' ')
}

export function readUnicodeTables(source: string): UnicodeTables {
  const file = ts.createSourceFile('strings.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const found = new Map<string, ts.Expression>()
  const put = (name: string, value: ts.Expression | undefined) => {
    assert(value && !found.has(name), 'Missing or repeated Unicode declaration')
    found.set(name, value)
  }
  for (const node of file.statements) {
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && ['CONTAINS_RTL', 'CONTAINS_EMOJI'].includes(declaration.name.text))
          put(declaration.name.text, declaration.initializer)
      }
    }
    if (ts.isFunctionDeclaration(node) && node.name && ['isEmojiImprecise', 'getGraphemeBreakRawData'].includes(node.name.text)) {
      assert.equal(node.body?.statements.length, 1, 'Unexpected Unicode function body')
      const statement = node.body.statements[0]!
      assert(ts.isReturnStatement(statement), 'Expected Unicode return')
      put(node.name.text, statement.expression)
    }
  }
  assert.equal(found.size, 4, 'Missing Unicode declarations')
  const regex = (name: string) => {
    const node = found.get(name)!
    assert(ts.isRegularExpressionLiteral(node), 'Expected Unicode regex literal')
    assert(node.text.startsWith('/') && node.text.endsWith('/'), 'Unexpected Unicode regex flags')
    return node.text.slice(1, -1)
  }
  const tree = found.get('getGraphemeBreakRawData')!
  assert(ts.isCallExpression(tree) && tree.expression.getText(file) === 'JSON.parse' && tree.arguments.length === 1 && ts.isStringLiteral(tree.arguments[0]!), 'Expected literal Unicode tree')
  const grapheme: unknown = JSON.parse(tree.arguments[0].text)
  assert(Array.isArray(grapheme) && grapheme.length > 0 && grapheme.length % 3 === 0 && grapheme.every(value => Number.isSafeInteger(value) && value >= 0), 'Invalid Unicode tree integers')
  return { rtl: regex('CONTAINS_RTL'), emoji: regex('CONTAINS_EMOJI'), imprecise: expressionText(found.get('isEmojiImprecise')!, file), grapheme }
}

// Execute only hash-verified upstream recipes. This VM controls recipe I/O, not hostile code.
export function replayUnicodeGenerator(source: string, inputs: Map<string, Uint8Array>, outputs: string[], regexpu: unknown): UnicodeOutput {
  const logs: string[] = []
  const writes = new Map<string, string>()
  const reads = new Set<string>()
  const io = {
    readFileSync(name: string) {
      assert(inputs.has(name), `Unexpected Unicode input: ${name}`)
      reads.add(name)
      return inputs.get(name)!
    },
    writeFileSync(name: string, value: string) {
      assert(outputs.includes(name) && !writes.has(name), 'Unexpected or repeated Unicode output')
      assert.equal(typeof value, 'string', 'Expected Unicode output text')
      writes.set(name, value)
    },
  }
  vm.runInNewContext(source, {
    require(name: string) {
      if (name === 'fs')
        return io
      if (name === 'assert')
        return assert
      assert.equal(name, 'regexpu', 'Unexpected Unicode import')
      return regexpu
    },
    console: { log: (...args: unknown[]) => logs.push(args.map(String).join(' ')) },
  }, { timeout: 15000 })
  assert.deepEqual([...reads].sort(), [...inputs.keys()].sort(), 'Unused Unicode input')
  assert.deepEqual([...writes.keys()].sort(), [...outputs].sort(), 'Missing Unicode output')
  return { logs, writes }
}

export function verifyUnicodeGeneration(tables: UnicodeTables, rtl: UnicodeOutput, emoji: UnicodeOutput, grapheme: UnicodeOutput): void {
  const pattern = (output: UnicodeOutput) => {
    const markers = output.logs.flatMap((line, index) => line === '------' ? [index] : [])
    assert(markers.length === 2 && markers[1] === markers[0]! + 2, 'Missing Unicode regex delimiters')
    return output.logs[markers[0]! + 1]
  }
  assert.equal(pattern(rtl), tables.rtl, 'Generated RTL differs from Monaco')
  assert.equal(pattern(emoji), tables.emoji, 'Generated emoji differs from Monaco')
  const expressions = emoji.logs.filter(line => line.startsWith('very imprecise test :: '))
  assert.equal(expressions.length, 1, 'Missing or repeated imprecise emoji expression')
  const file = ts.createSourceFile('expression.ts', expressions[0]!.slice('very imprecise test :: '.length), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  assert.equal(file.statements.length, 1, 'Unexpected imprecise emoji expression')
  const statement = file.statements[0]!
  assert(ts.isExpressionStatement(statement), 'Expected imprecise emoji expression')
  assert.equal(expressionText(statement.expression, file), tables.imprecise, 'Generated imprecise emoji differs from Monaco')
  assert.deepEqual(JSON.parse(grapheme.logs[grapheme.logs.length - 1]!), tables.grapheme, 'Generated grapheme tree differs from Monaco')
}
