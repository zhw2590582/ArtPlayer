import type { Cue, CueNode, TimestampNode, WrappedNode } from './parser'
import type { Track, TrackOption } from './types'
import { WebVTTParser, WebVTTSerializer } from './parser'

export const TIMESTAMP_CLASS = 'artplayer-multiple-subtitles-timestamp'

function markTimestamp(node: TimestampNode): CueNode {
  return { type: 'object', name: 'c', classes: [TIMESTAMP_CLASS], children: [node] }
}

function markNestedTimestamps(node: CueNode): CueNode {
  if (node.type === 'timestamp')
    return markTimestamp(node)
  if (node.type === 'object')
    return { ...node, children: node.children.map(markNestedTimestamps) }
  return node
}

export function parseTracks(vtts: readonly string[], subtitles: readonly TrackOption[]): Track[] {
  const parser = new WebVTTParser()
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
      cues.push({
        ...cue,
        tree: {
          ...cue.tree,
          children: cue.tree.children.map((child) => {
            if (child.type === 'timestamp')
              return markTimestamp(child)
            const value = `<div class="art-subtitle-${tree.name}">${child.value}</div>`
            return child.type === 'object'
              ? { ...child, value, children: child.children.map(markNestedTimestamps) }
              : { ...child, value }
          }),
        },
      })
    }
  }
  return new WebVTTSerializer().serialize(cues)
}
