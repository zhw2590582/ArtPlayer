import type { Factory } from 'artplayer-plugin-vtt-thumbnail'

declare const replacement: Factory
const required: Factory & { default: Factory } = replacement
const optional: Factory & { default?: Factory } = replacement
optional.default({})
void required
