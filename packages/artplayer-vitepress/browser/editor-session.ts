interface SessionOptions {
  loadLibraries: (encoded: string) => Promise<unknown>
  exampleSource: (name: string) => Promise<string>
  writeCode: (source: string) => void
  compile: (source: string) => Promise<string>
  execute: (code: string) => void
}

export function createEditorSession(options: SessionOptions) {
  let generation = 0
  let disposed = false
  return {
    async run({
      libs = '',
      code,
      example,
    }: {
      libs?: string
      code?: string
      example?: string
    }): Promise<void> {
      const current = ++generation
      const active = () => !disposed && current === generation
      if (!active())
        return
      await options.loadLibraries(libs)
      if (!active())
        return
      const source = example
        ? await options.exampleSource(example)
        : code
          ? decodeURIComponent(code).trim()
          : await options.exampleSource('index')
      if (!active())
        return
      options.writeCode(source)
      const executable = await options.compile(source)
      if (active())
        options.execute(executable)
    },
    dispose(): void {
      disposed = true
      generation++
    },
  }
}

export function executeClassic(code: string): void {
  // eslint-disable-next-line no-new-func -- The existing editor explicitly executes user-entered classic script on Run.
  new Function(code)()
}
