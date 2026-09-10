const element: HTMLDivElement = document.createElement('div')
const value: string | undefined = ['first'][1]
void [element, value]

// @ts-expect-error Node globals must not leak into browser packages.
globalThis.process.cwd() // eslint-disable-line node/prefer-global/process -- Check that browser projects cannot see ambient Node globals.
// @ts-expect-error Array indexing may return undefined in implementation checks.
const unchecked: string = ['first'][1]
void unchecked
