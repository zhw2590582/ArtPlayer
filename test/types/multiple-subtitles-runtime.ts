import type Artplayer from 'artplayer'
import type { CueNode, TimestampNode } from '../../packages/artplayer-plugin-multiple-subtitles/src/parser'
import type { Option, Result } from '../../packages/artplayer-plugin-multiple-subtitles/src/types'
import factory from '../../packages/artplayer-plugin-multiple-subtitles/src/index'
import createLifetime from '../../packages/artplayer-plugin-multiple-subtitles/src/lifetime'
import { parseTracks, serializeTracks } from '../../packages/artplayer-plugin-multiple-subtitles/src/merge'
import { WebVTTParser } from '../../packages/artplayer-plugin-multiple-subtitles/src/parser'
import loadVtt from '../../packages/artplayer-plugin-multiple-subtitles/src/request'
import legacyFactory from '../../packages/artplayer-plugin-multiple-subtitles/types/artplayer-plugin-multiple-subtitles'

declare const art: Artplayer
const option: Option = { subtitles: [{ url: '/a.vtt', name: 'a', type: 'vtt' }] }
const register = factory(option)
const pending: Promise<Result> = register(art)
pending.then((result) => {
  result.name satisfies 'multipleSubtitles'
  const returned: void = result.tracks(['a'])
  result.reset()
  void returned
  // @ts-expect-error Selection names are strings.
  result.tracks([1])
})
factory({})(art)
factory({ subtitles: [{}] })(art)
// @ts-expect-error Factory options remain required.
factory()
// @ts-expect-error Registration is asynchronous, with no synchronous name.
void pending.name
// @ts-expect-error Invalid subtitle format is rejected.
factory({ subtitles: [{ type: 'xml' }] })

const lifetime = createLifetime(art)
const waited: Promise<number | void> = lifetime.wait(Promise.resolve(3))
const text: Promise<string | void> = loadVtt({}, (art.constructor as typeof Artplayer).utils, lifetime)
void waited
void text
// @ts-expect-error Lifetime state cannot be assigned.
lifetime.closed = false

const parser = new WebVTTParser()
const parsed = parser.parse('WEBVTT\n\n', 'metadata')
parsed.errors.forEach(error => error.message.toUpperCase())
const nodes: CueNode[] = parsed.cues[0]!.tree.children
for (const node of nodes) {
  if (node.type === 'timestamp')
    node.value.toFixed()
  if (node.type === 'text')
    node.value.toUpperCase()
}
const timestamp: TimestampNode = { type: 'timestamp', value: 2 }
void timestamp
// @ts-expect-error Parsed timestamps are numbers, not wrapped serialized values.
const wrongTimestamp: TimestampNode = { type: 'timestamp', value: '2' }
void wrongTimestamp
const trees = parseTracks(['WEBVTT\n\n'], [{}])
const vtt: string = serializeTracks(trees)
void vtt
// @ts-expect-error The pure serializer returns text.
const number: number = serializeTracks(trees)
void number

legacyFactory({ subtitles: [] })(art).name satisfies 'multipleSubtitles'
// @ts-expect-error Historical synchronous return extraction cannot be silently replaced.
const oldRegistration: ReturnType<typeof legacyFactory> = register
void oldRegistration
