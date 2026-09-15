import type { RuntimeOptions } from './types'
import { clamp } from './utils'

export function thumbnailPolicy(option: RuntimeOptions) {
  const workspace = option.compatibility === 'workspace-4.4'
  return { delay: workspace ? null : option.delay, aspectHeight: workspace, resetInput: workspace }
}

export function normalizePolicy(option: RuntimeOptions, validate: (condition: unknown, message: string) => void) {
  validate(option.compatibility === undefined || option.compatibility === 'published-3.5' || option.compatibility === 'workspace-4.4', 'The compatibility option must be published-3.5 or workspace-4.4')
  const workspace = thumbnailPolicy(option).aspectHeight
  const fields = workspace ? ['number', 'width', 'column', 'begin', 'end'] : ['delay', 'number', 'width', 'height', 'column', 'begin', 'end']
  for (const name of fields)
    validate(typeof option[name] === 'number', `The '${name}' is not a number`)
  option.number = clamp(option.number, 10, 1000)
  option.width = clamp(option.width, 10, 1000)
  option.column = clamp(option.column, 1, 1000)
  if (!workspace) {
    option.delay = clamp(Number(option.delay), 10, 1000)
    option.height = clamp(option.height, 10, 1000)
  }
}
