import type { Option, Thumbnails } from '../../types/option'
import type { Subtitle } from '../../types/subtitle'

export type { Option } from '../../types/option'

// A successfully merged typed input, not a general guard for arbitrary JS objects.
export interface ResolvedOption extends Omit<Required<Option>, 'proxy' | 'subtitle' | 'thumbnails'> {
  proxy: Option['proxy']
  subtitle: Required<Subtitle>
  thumbnails: Required<Thumbnails>
}

export type ResolvedInput<Input extends Option> = ResolvedOption & Omit<Input, keyof Option>
