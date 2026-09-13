import type Artplayer from '../../artplayer/public/artplayer.ts'
import { createLibraryLoader, exampleSource, parameters } from './loader.ts'

declare global {
  interface Window { Artplayer: typeof Artplayer }
}

window.Artplayer.DEBUG = true
const loader = createLibraryLoader()
window.addEventListener('pagehide', (event) => {
  if (!event.persisted)
    loader.dispose()
})

async function start(): Promise<void> {
  const { code, libs, example } = parameters(location.href)
  await loader.loadLibraries(libs)
  const source = example ? await exampleSource(example) : code ? decodeURIComponent(code).trim() : await exampleSource('mobile')
  // eslint-disable-next-line no-new-func -- Run user-selected example code in the existing classic-script function scope.
  new Function(source)()
}

start().catch(error => console.error('Failed to initialize mobile example:', error))
