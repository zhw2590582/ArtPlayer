export function readEditorFile(
  file: File,
  signal: AbortSignal,
  createReader: () => FileReader = () => new FileReader(),
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = createReader()
    function clear() {
      reader.onload = null
      reader.onerror = null
      reader.onabort = null
      signal.removeEventListener('abort', cancel)
    }
    function fail(error: unknown) {
      clear()
      reject(error)
    }
    function cancel() {
      reader.abort()
      fail(new Error(`File import cancelled: ${file.name}`))
    }
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        fail(new Error(`File is not text: ${file.name}`))
        return
      }
      const value = reader.result
      clear()
      resolve(value)
    }
    reader.onerror = () =>
      fail(reader.error || new Error(`Reading file failed: ${file.name}`))
    reader.onabort = () =>
      fail(new Error(`File import cancelled: ${file.name}`))
    signal.addEventListener('abort', cancel, { once: true })
    try {
      if (signal.aborted)
        cancel()
      else reader.readAsText(file)
    }
    catch (error) {
      fail(error)
    }
  })
}

export function createFileImports(
  document: Document,
  label: (name: string) => void,
) {
  const controller = new AbortController()
  const elements: HTMLElement[] = []
  let queue: Promise<unknown> = Promise.resolve()
  return {
    add(files: File[]): Promise<void> {
      const work = queue.then(async () => {
        for (const file of files) {
          const name = file.name.toLowerCase().trim()
          if (!name.endsWith('.js') && !name.endsWith('.css'))
            continue
          const text = await readEditorFile(file, controller.signal)
          if (controller.signal.aborted)
            return
          const element = document.createElement(
            name.endsWith('.css') ? 'style' : 'script',
          )
          element.textContent = text
          document.body.appendChild(element)
          elements.push(element)
          label(name)
        }
      })
      queue = work.catch(() => {})
      return work
    },
    dispose(): void {
      controller.abort()
      for (const element of elements) element.remove()
      elements.length = 0
    },
  }
}
