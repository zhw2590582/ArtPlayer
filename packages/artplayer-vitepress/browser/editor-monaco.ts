import type { Editor, EditorHost } from './editor-host.ts'
import { libUris } from './editor-libraries.ts'

export async function createMonaco(
  host: EditorHost,
  container: HTMLElement,
  typescript: boolean,
  signal: AbortSignal,
) {
  host.require.config({ paths: { vs: './assets/js/vs' } })
  await new Promise<void>((resolve, reject) =>
    host.require(['vs/editor/editor.main'], resolve, reject),
  )
  await new Promise<void>((resolve, reject) =>
    host.require(
      [
        'vs/basic-languages/typescript/typescript',
        'vs/basic-languages/javascript/javascript',
        'vs/language/typescript/tsMode',
      ],
      resolve,
      reject,
    ),
  )
  if (signal.aborted)
    throw new Error('Editor initialization cancelled')
  const api = host.monaco
  const types = api.languages.typescript
  const resources: { dispose: () => void }[] = []
  const temporary = new Set<ReturnType<typeof api.editor.createModel>>()
  let editor: Editor | undefined
  let disposed = false
  const dispose = () => {
    if (disposed)
      return
    disposed = true
    signal.removeEventListener('abort', dispose)
    editor?.dispose()
    editor = undefined
    for (const model of temporary) model.dispose()
    temporary.clear()
    for (const resource of resources.splice(0).reverse()) resource.dispose()
  }
  signal.addEventListener('abort', dispose, { once: true })
  try {
    for (const defaults of [
      types.javascriptDefaults,
      types.typescriptDefaults,
    ]) {
      defaults.setDiagnosticsOptions({
        noSemanticValidation: defaults === types.javascriptDefaults,
        noSyntaxValidation: false,
      })
      defaults.setCompilerOptions({
        target: types.ScriptTarget.ES2015,
        module: types.ModuleKind.None,
        allowNonTsExtensions: true,
        noEmit: false,
      })
    }
    for (const uri of libUris) {
      const response = await host.fetch(uri, { signal })
      if (!response.ok) {
        throw new Error(
          `Loading editor declaration failed: ${uri} (${response.status})`,
        )
      }
      const source = await response.text()
      if (signal.aborted)
        throw new Error('Editor initialization cancelled')
      resources.push(
        types.javascriptDefaults.addExtraLib(source, uri),
        types.typescriptDefaults.addExtraLib(source, uri),
      )
      resources.push(
        api.editor.createModel(source, 'typescript', api.Uri.parse(uri)),
      )
    }
    const model = api.editor.createModel(
      'var art = new Artplayer({\n\tcontainer: \'.artplayer-app\',\n\turl: \'/assets/sample/video.mp4\',\n});',
      typescript ? 'typescript' : 'javascript',
    )
    resources.push(model)
    editor = api.editor.create(container, {
      theme: 'vs-dark',
      folding: true,
      automaticLayout: true,
      quickSuggestions: { other: true, comments: true, strings: true },
      model,
    })
    return {
      editor,
      async compile(source: string): Promise<string> {
        if (disposed)
          throw new Error('Editor was disposed')
        if (!typescript)
          return source
        const model = api.editor.createModel(source, 'typescript')
        temporary.add(model)
        try {
          const worker = await (await types.getTypeScriptWorker())(model.uri)
          const file = model.uri.toString()
          const syntax = await worker.getSyntacticDiagnostics(file)
          if (syntax.length) {
            throw new Error(
              `TypeScript syntax error: ${syntax.map(item => (typeof item.messageText === 'string' ? item.messageText : item.messageText.messageText)).join('; ')}`,
            )
          }
          const output = await worker.getEmitOutput(file)
          const script = output.outputFiles.find(file =>
            file.name.endsWith('.js'),
          )
          if (output.emitSkipped || !script)
            throw new Error('TypeScript worker did not emit JavaScript')
          return script.text
        }
        finally {
          temporary.delete(model)
          if (!model.isDisposed())
            model.dispose()
        }
      },
      dispose,
    }
  }
  catch (error) {
    dispose()
    throw error
  }
}
