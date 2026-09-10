import type { OptionInput, ResolvedInput, ResolvedOption } from './types'
import validator from 'option-validator'
import scheme from '../scheme'
import { mergeDeep } from '../utils/property'

export default function resolveOption<Input extends OptionInput>(input: Input, defaults: ResolvedOption): ResolvedInput<Input> {
  const merged = mergeDeep(defaults, input)
  merged.container = input.container
  // Keep the existing runtime validator. It checks the known schema, not extension data.
  return validator(merged, scheme) as ResolvedInput<Input>
}
