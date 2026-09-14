import type * as Monaco from 'monaco-editor'
import type {
  createLibraryLoader,
  exampleSource,
  parameters,
} from './loader.ts'

export interface EditorPlayer {
  destroy: (removeHtml?: boolean) => unknown
}
export interface AmdLoader {
  (
    modules: string[],
    ready: () => void,
    failed: (error: unknown) => void,
  ): void
  config: (options: { paths: { vs: string } }) => void
}
export type EditorHost = Window & {
  console: Console
  Artplayer: {
    DEBUG: boolean
    utils: { isMobile: boolean }
    instances: EditorPlayer[]
  }
  monaco: typeof Monaco
  require: AmdLoader
  consoleLog: ((element: HTMLElement) => unknown) & { unmount?: (element: HTMLElement) => boolean }
  ArtplayerDocsLoader: ReturnType<typeof createLibraryLoader> & {
    exampleSource: typeof exampleSource
    parameters: typeof parameters
  }
  art: EditorPlayer | undefined
}

export type Editor = Monaco.editor.IStandaloneCodeEditor
