// Only the installed APIs used by library tooling; not general SDK declarations.
declare module 'prompts' {
  export default function prompts(question: {
    type: 'select'
    name: 'value'
    message: string
    choices: { title: string, value: string }[]
  }): Promise<{ value?: string }>
}

declare module 'servor' {
  export default function servor(options: {
    root: string
    fallback: string
    reload: boolean
    port: number
  }): Promise<{ url: string }>
}

declare module 'servor/utils/openBrowser.js' {
  export default function openBrowser(url: string): true | undefined
}
