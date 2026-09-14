import type { DomRuntime, ReactRuntime } from './types.ts'

export function install(React: ReactRuntime, ReactDOM: DomRuntime, View: ReactRuntime['Component'], host: Record<string, unknown>) {
  const consoleLog = (element: Element) => ReactDOM.render(React.createElement(View), element)
  consoleLog.unmount = (element: Element) => ReactDOM.unmountComponentAtNode(element)
  host.React = React
  host.ReactDOM = ReactDOM
  host.consoleLog = consoleLog
  return consoleLog
}
