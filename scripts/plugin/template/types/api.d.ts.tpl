import type Artplayer from 'artplayer'

// Replace this empty option type with the documented options your plugin owns.
export type Option = Record<string, never>
export interface Result { name: '{{export}}' }
export type Factory = (option?: Option) => (art: Artplayer) => Result
export type RuntimeFactory = Factory & { default: Factory }
