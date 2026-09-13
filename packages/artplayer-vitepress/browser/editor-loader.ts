import { createLibraryLoader, exampleSource, parameters } from './loader.ts'

const loader = createLibraryLoader()
Object.assign(window, { ArtplayerDocsLoader: { ...loader, exampleSource, parameters } })
window.addEventListener('pagehide', (event) => {
  if (!event.persisted)
    loader.dispose()
})
