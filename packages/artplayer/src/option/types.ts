import type { OptionInput, Thumbnails } from '../../types/option'
import type { Subtitle } from '../../types/subtitle'

export type { Option, OptionInput } from '../../types/option'

// A successfully merged typed input, not a general guard for arbitrary JS objects.
export interface ResolvedOption extends Omit<Required<OptionInput>, 'proxy' | 'subtitle' | 'thumbnails'> {
  proxy: OptionInput['proxy']
  subtitle: Required<Subtitle>
  thumbnails: Required<Thumbnails>
}

export interface DefaultOption extends Omit<ResolvedOption, 'lang'> {
  lang: OptionInput['lang']
}

export type ResolvedInput<Input extends OptionInput> = ResolvedOption & Omit<Input, keyof OptionInput>
