import type { EngineOptions, EnginePort } from './engine-types'

declare const MediaBunnyEngine: new (options: EngineOptions) => EnginePort
export default MediaBunnyEngine
