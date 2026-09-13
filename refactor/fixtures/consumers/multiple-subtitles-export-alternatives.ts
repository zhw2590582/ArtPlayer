import type { Factory } from 'artplayer-plugin-multiple-subtitles'

declare const replacement: Factory
const required: Factory & { default: Factory } = replacement
const optional: Factory & { default?: Factory } = replacement
optional.default({ subtitles: [] })
void required
