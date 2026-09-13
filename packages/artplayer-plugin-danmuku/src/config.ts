import type { DanmukuOption, NormalizedOption } from './types'

export function defaultOption(): NormalizedOption & { fontSize: number, margin: [number, string] } {
  return {
    danmuku: [],
    speed: 5,
    margin: [10, '25%'],
    opacity: 1,
    color: '#FFFFFF',
    mode: 0,
    modes: [0, 1, 2],
    fontSize: 25,
    antiOverlap: true,
    synchronousPlayback: false,
    mount: undefined,
    heatmap: false,
    width: 512,
    points: [],
    filter: () => true,
    beforeEmit: () => true,
    beforeVisible: () => true,
    visible: true,
    emitter: true,
    maxLength: 200,
    lockTime: 5,
    theme: 'dark',
    OPACITY: {},
    FONT_SIZE: {},
    MARGIN: {},
    SPEED: {},
    COLOR: [],
  }
}

export function optionScheme() {
  return {
    danmuku: 'array|function|string|promise',
    speed: 'number',
    margin: 'array',
    opacity: 'number',
    color: 'string',
    mode: 'number',
    modes: 'array',
    fontSize: 'number|string',
    antiOverlap: 'boolean',
    synchronousPlayback: 'boolean',
    mount: '?htmldivelement|string',
    heatmap: 'object|boolean',
    width: 'number',
    points: 'array',
    filter: 'function',
    beforeEmit: 'function',
    beforeVisible: 'function',
    visible: 'boolean',
    emitter: 'boolean',
    maxLength: 'number',
    lockTime: 'number',
    theme: 'string',
    OPACITY: 'object',
    FONT_SIZE: 'object',
    MARGIN: 'object',
    SPEED: 'object',
    COLOR: 'array',
  }
}

export function isPromiseInput(value: unknown): value is Promise<unknown> {
  return value instanceof Promise || Object.prototype.toString.call(value) === '[object Promise]'
}

export function optionChanged(previous: NormalizedOption, update: DanmukuOption) {
  return Object.keys(update).some((key) => {
    const before = previous[key as keyof NormalizedOption]
    const after = update[key as keyof NormalizedOption]
    if (typeof before === 'function' || typeof after === 'function' || isPromiseInput(before) || isPromiseInput(after))
      return before !== after
    return JSON.stringify(before) !== JSON.stringify(after)
  })
}

export function normalizeOption(previous: NormalizedOption, update: DanmukuOption, { defaults, validate, clamp, mount }: { defaults: NormalizedOption, validate: (value: NormalizedOption) => unknown, clamp: (value: number, min: number, max: number) => number, mount: HTMLDivElement }): NormalizedOption {
  const next = Object.assign({}, defaults, previous, update)
  validate(next)
  next.mode = clamp(next.mode, 0, 2)
  next.speed = clamp(next.speed, 1, 10)
  next.opacity = clamp(next.opacity, 0, 1)
  next.lockTime = clamp(next.lockTime, 1, 60)
  next.maxLength = clamp(next.maxLength, 1, 1000)
  next.mount = next.mount || mount
  return next
}
