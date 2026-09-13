import MarkdownIt from 'markdown-it'

export interface DocumentationExample {
  id: string
  file: string
  line: number
  code: string
}

const markdown = new MarkdownIt({ html: true })

export function extractExamples(content: string, file: string): DocumentationExample[] {
  const normalized = content.replaceAll('\r\n', '\n')
  const lines = normalized.split('\n')
  const tokens = markdown.parse(normalized, {})
  const examples: DocumentationExample[] = []
  for (const [index, marker] of tokens.entries()) {
    if (marker.type !== 'html_block' || !/<div\s+class(?:Name)?="run-code"[\s>]/.test(marker.content))
      continue
    const line = (marker.map?.[0] ?? 0) + 1
    const invalid = (message: string) => new Error(`${file}:${line}: ${message}`)
    const fence = tokens[index + 1]
    if (!fence || fence.type !== 'fence' || !/^js(?:\{|\s|$)/.test(fence.info))
      throw invalid('Run Code must be followed by a JavaScript fence')
    const range = fence.map
    if (!range)
      throw invalid('Missing code fence source range')
    const closing = lines[range[1] - 1]?.trim() || ''
    if (closing.length < fence.markup.length || [...closing].some(character => character !== fence.markup[0]))
      throw invalid('Unclosed Run Code fence')
    const code = fence.content.trim()
    if (!code)
      throw invalid('Empty Run Code example')
    examples.push({ id: `${file}:${range[0] + 2}`, file, line: range[0] + 2, code })
  }
  return examples
}
