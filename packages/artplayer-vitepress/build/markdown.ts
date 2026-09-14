import type MarkdownIt from 'markdown-it'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

export function stableCodeGroups(markdown: MarkdownIt): void {
  const original = markdown.renderer.rules['container_code-group_open']
  assert(original, 'Expected VitePress code-group renderer')
  markdown.renderer.rules['container_code-group_open'] = (
    tokens,
    index,
    options,
    env: unknown,
    renderer,
  ) => {
    const relative
      = env
        && typeof env === 'object'
        && 'relativePath' in env
        && typeof env.relativePath === 'string'
        ? env.relativePath.replaceAll('\\', '/')
        : ''
    const prefix = createHash('sha256')
      .update(`${relative}:${index}`)
      .digest('hex')
      .slice(0, 16)
    const ids = new Map<string, string>()
    return original(tokens, index, options, env, renderer)
      .replace(/name="group-[^"]+"/g, `name="group-artplayer-${prefix}"`)
      .replace(
        /(id|for)="(tab-[^"]+)"/g,
        (_match, attribute: string, id: string) => {
          if (!ids.has(id))
            ids.set(id, `tab-artplayer-${prefix}-${ids.size}`)
          return `${attribute}="${ids.get(id)}"`
        },
      )
  }
}
