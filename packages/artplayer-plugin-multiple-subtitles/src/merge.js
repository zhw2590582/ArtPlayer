import { WebVTTParser, WebVTTSerializer } from './parser'

export function parseTracks(vtts, subtitles) {
  const parser = new WebVTTParser()
  return vtts.map((vtt, index) => {
    const tree = parser.parse(vtt, 'metadata')
    tree.url = subtitles[index].url
    tree.name = subtitles[index].name
    return tree
  })
}

export function serializeTracks(trees) {
  const cues = []
  for (const tree of trees) {
    for (const cue of tree.cues) {
      cues.push({
        ...cue,
        tree: {
          ...cue.tree,
          children: cue.tree.children.map(child => ({
            ...child,
            value: `<div class="art-subtitle-${tree.name}">${child.value}</div>`,
          })),
        },
      })
    }
  }
  return new WebVTTSerializer().serialize(cues)
}
