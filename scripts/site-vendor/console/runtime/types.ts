import type * as React from 'react'

export interface Log { method: string, id?: string, data?: unknown[] }
export type Parser = (method: string, args: unknown[], id?: string) => Log | false
export type NativeMethod = (this: unknown, ...args: unknown[]) => unknown
export interface ConsoleTarget { [method: string]: unknown }
export interface Clock {
  setTimeout: (callback: () => void, delay: number) => number
  clearTimeout: (id: number) => void
}
export interface Feed { Console: React.ComponentType<{ logs: Log[], variant: string }> }
export interface Styled { div: (strings: TemplateStringsArray) => React.ComponentType<React.PropsWithChildren> }
export type ReactRuntime = typeof React
export interface DomRuntime {
  render: (element: React.ReactElement, container: Element) => unknown
  unmountComponentAtNode: (container: Element) => boolean
}
