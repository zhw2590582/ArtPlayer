import type { Option, Result } from 'artplayer-plugin-danmuku'
import danmuku from 'artplayer-plugin-danmuku'
import legacy from 'artplayer-plugin-danmuku/legacy'

const legacyFactory: typeof danmuku = legacy
const rootFactory: typeof legacy = danmuku
const option: Option = { danmuku: [], points: [{ time: 1, value: 2 }] }
danmuku(option)
legacy(option)
declare const result: Result
const synchronous: Result = result.emit({ text: 'historical declaration' })
void [legacyFactory, rootFactory, synchronous]

// @ts-expect-error The published root requires its option argument.
danmuku()
// @ts-expect-error The published root requires danmuku in Option.
danmuku({})
// @ts-expect-error Preserve historical object points at the root.
danmuku({ danmuku: [], points: [[1, 2]] })
// @ts-expect-error Root emit keeps its published synchronous Result shape.
const asynchronous: Promise<Result> = result.emit({ text: 'old emit' })
void asynchronous
