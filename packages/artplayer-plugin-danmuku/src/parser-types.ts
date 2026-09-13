import type { DanmuInput } from './types'

export interface ParsedDanmu extends DanmuInput {
  time: number
  mode: number
  fontSize: number
  color: string
  timestamp: number
  pool: number
  userID: string
  rowID: number
}

export interface ParserRequest { xml: unknown, id: number }
export interface ParserReply { danmus: ParsedDanmu[], id: number }

export interface ParserCancellation {
  signal?: AbortSignal
  onCancel?: (callback: () => void) => () => void
}
