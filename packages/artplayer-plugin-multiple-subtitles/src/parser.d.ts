export interface TextNode {
  type: 'text'
  value: string
}

export interface ObjectNode {
  type: 'object'
  name: string
  classes: string[]
  value?: string
  children: CueNode[]
}

export interface TimestampNode {
  type: 'timestamp'
  value: number
}

export type CueNode = TextNode | ObjectNode | TimestampNode
// The historical plugin wraps every top-level value, including timestamp nodes.
export type WrappedNode = TextNode | (Omit<ObjectNode, 'value'> & { value: string }) | { type: 'timestamp', value: string }

export interface Cue<Node = CueNode> {
  id: string
  startTime: number
  endTime: number
  pauseOnExit: boolean
  direction: 'horizontal' | 'rl' | 'lr'
  snapToLines: boolean
  linePosition: number | 'auto'
  lineAlign: 'start' | 'center' | 'end'
  textPosition: number | 'auto'
  positionAlign: 'auto' | 'line-left' | 'center' | 'line-right'
  size: number
  alignment: 'start' | 'center' | 'end' | 'left' | 'right'
  text: string
  tree: { children: Node[] }
  nonSerializable?: boolean
}

export interface ParseResult {
  cues: Cue[]
  errors: { message: string, line: number, col: number | undefined }[]
  styles: string[]
  time: number
}

// Private declaration for the vendored exports used by this package, not a new public API.
export declare class WebVTTParser {
  constructor(entities?: Record<string, string>)
  parse(input: string, mode: 'metadata'): ParseResult
}

export declare class WebVTTSerializer {
  serialize(cues: readonly Cue<CueNode | WrappedNode>[], styles?: readonly string[]): string
}
