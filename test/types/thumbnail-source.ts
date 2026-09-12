import type Definition from 'artplayer-tool-thumbnail'
import Implementation from '../../packages/artplayer-tool-thumbnail/src'

const constructor: typeof Definition = Implementation
const RuntimeConstructor: typeof Implementation = constructor
const value: Definition = new RuntimeConstructor({ fileInput: document.createElement('input') })
value.on('custom', (count: number) => count.toFixed())
void value
