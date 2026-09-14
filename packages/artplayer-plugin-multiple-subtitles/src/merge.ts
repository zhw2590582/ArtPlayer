import type { Cue, CueNode, TimestampNode, WrappedNode } from './parser'
import type { Track, TrackOption } from './types'
import { WebVTTParser, WebVTTSerializer } from './parser'
import { cueEntities, escapeCueText } from './text'

export const TIMESTAMP_CLASS = 'artplayer-multiple-subtitles-timestamp'

function markTimestamp(node: TimestampNode): CueNode {
  return { type: 'object', name: 'c', classes: [TIMESTAMP_CLASS], children: [node] }
}

function prepareCueNode(node: CueNode): CueNode {
  if (node.type === 'timestamp')
    return markTimestamp(node)
  if (node.type === 'object')
    return { ...node, children: node.children.map(prepareCueNode) }
  return { ...node, value: escapeCueText(node.value) }
}

export function parseTracks(vtts: readonly string[], subtitles: readonly TrackOption[]): Track[] {
  const parser = new WebVTTParser(cueEntities)
  return vtts.map((vtt, index) => {
    const tree = parser.parse(vtt, 'metadata')
    // Options and completed downloads share the same Promise.all index.
    return { ...tree, url: subtitles[index]!.url, name: subtitles[index]!.name }
  })
}

export function serializeTracks(trees: readonly (Track | undefined)[]): string {
  const cues: Cue<WrappedNode>[] = []
  for (const selected of trees) {
    // Unknown names retain the historical TypeError at the property access below.
    const tree = selected!
    for (const cue of tree.cues) {
      const children: CueNode[] = []
      for (const child of cue.tree.children) {
        if (child.type === 'timestamp')
          children.push(markTimestamp(child))
        else children.push(
          { type: 'text', value: `<div class="art-subtitle-${tree.name}">` },
          prepareCueNode(child),
          { type: 'text', value: '</div>' },
        )
      }
      cues.push({
        ...cue,
        tree: {
          ...cue.tree,
          children,
        },
      })
    }
  }
  return new WebVTTSerializer().serialize(cues)
}
