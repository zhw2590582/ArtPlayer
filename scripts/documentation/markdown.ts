import assert from 'node:assert/strict'
import MarkdownIt from 'markdown-it'
import { sha256 } from './files.ts'

const parser = new MarkdownIt({ html: true })

export function markdownSignature(source: string): string[] {
  const result: string[] = []
  function visit(tokens: ReturnType<MarkdownIt['parse']>): void {
    for (const token of tokens) {
      if (
        [
          'fence',
          'code_block',
          'code_inline',
          'html_block',
          'html_inline',
        ].includes(token.type)
      ) {
        result.push(JSON.stringify([token.type, token.info, token.content]))
      }
      if (
        [
          'heading_open',
          'bullet_list_open',
          'ordered_list_open',
          'list_item_open',
          'blockquote_open',
          'table_open',
          'tr_open',
          'th_open',
          'td_open',
        ].includes(token.type)
      ) {
        result.push(JSON.stringify([token.type, token.tag]))
      }
      if (token.type === 'link_open')
        result.push(`link:${token.attrGet('href')}`)
      if (token.type === 'image')
        result.push(`image:${token.attrGet('src')}`)
      if (token.children)
        visit(token.children)
    }
  }
  visit(parser.parse(source, {}))
  result.push(...source.split('\n').filter(line => /^\s*:::/.test(line)))
  return result
}

export function protectMarkdown(source: string): {
  masked: string
  restore: (translated: string) => string
} {
  const lines = source.split('\n')
  const ranges: [number, number][] = []
  for (const token of parser.parse(source, {})) {
    if (
      !token.map
      || !['fence', 'code_block', 'html_block'].includes(token.type)
    ) {
      continue
    }
    if (token.type === 'fence') {
      const closing = lines[token.map[1] - 1]?.trim() || ''
      assert(
        closing.length >= token.markup.length
        && [...closing].every(char => char === token.markup[0]),
        'Unclosed source code fence',
      )
    }
    ranges.push([...token.map])
  }
  lines.forEach((line, index) => {
    if (/^\s*:::/.test(line))
      ranges.push([index, index + 1])
  })
  const merged: [number, number][] = []
  for (const range of ranges.sort((a, b) => a[0] - b[0])) {
    const previous = merged[merged.length - 1]
    if (previous && range[0] <= previous[1])
      previous[1] = Math.max(previous[1], range[1])
    else merged.push(range)
  }
  const prefix = `ARTPLAYER_KEEP_${sha256(source).slice(0, 16)}_`
  assert(!source.includes(prefix), 'Protection marker collision')
  const blocks: { marker: string, content: string }[] = []
  const output: string[] = []
  let cursor = 0
  for (const [start, end] of merged) {
    output.push(...lines.slice(cursor, start))
    const marker = `${prefix}${blocks.length}_END`
    blocks.push({ marker, content: lines.slice(start, end).join('\n') })
    output.push(marker)
    cursor = end
  }
  output.push(...lines.slice(cursor))
  return {
    masked: output.join('\n'),
    restore(translated: string): string {
      let result = translated
      for (const block of blocks) {
        assert(
          result.split(block.marker).length === 2,
          'Translation lost or duplicated a protected block',
        )
        result = result.replace(block.marker, () => block.content)
      }
      assert(
        !result.includes(prefix),
        'Unexpected protection marker in translation',
      )
      assert.deepEqual(
        markdownSignature(result),
        markdownSignature(source),
        'Translation changed code, HTML, links or Markdown structure',
      )
      return result
    },
  }
}

export function splitTranslation(masked: string, limit = 4000): string[] {
  assert(
    Number.isInteger(limit) && limit >= 128,
    'Invalid translation chunk limit',
  )
  const lines = masked.split('\n')
  const structuralEnds = new Map<number, number>()
  for (const token of parser.parse(masked, {})) {
    if (token.map && ['table_open', 'bullet_list_open', 'ordered_list_open', 'blockquote_open'].includes(token.type)) {
      const [start, end] = token.map
      structuralEnds.set(start, Math.max(end, structuralEnds.get(start) || 0))
    }
  }
  const chunks: string[] = []
  let current = ''
  for (let index = 0; index < lines.length; index++) {
    const end = structuralEnds.get(index)
    let line = end ? lines.slice(index, end).join('\n') : lines[index]!
    if (end) {
      assert(line.length <= limit, 'Markdown structural block exceeds translation chunk limit; split the source block or increase the limit')
      index = end - 1
    }
    while (line.length > limit) {
      if (current.trim())
        chunks.push(current)
      current = ''
      let end = limit
      if (/[\uD800-\uDBFF]/.test(line.charAt(end - 1)))
        end--
      chunks.push(line.slice(0, end))
      line = line.slice(end)
    }
    if (current.length + line.length + 1 > limit) {
      if (current.trim())
        chunks.push(current)
      current = ''
    }
    current += `${current ? '\n' : ''}${line}`
  }
  if (current.trim())
    chunks.push(current)
  return chunks
}
