import type { Feed, Log, Parser, ReactRuntime, Styled } from './types.ts'
import { css } from './style.ts'
import { createSubscriptions } from './subscriptions.ts'

export function createView(React: ReactRuntime, feed: Feed, styled: Styled, parse: Parser, methods: string[]) {
  const template = Object.freeze(Object.defineProperty([css], 'raw', { value: Object.freeze([css]) })) as unknown as TemplateStringsArray
  const Container = styled.div(template)
  const subscribe = createSubscriptions(window.console as unknown as Record<string, unknown>, methods, parse, window)
  interface State { logs: Log[], hover: boolean }
  return class ConsoleView extends React.Component<object, State> {
    scrollTimer: number | null = null
    consoleRef = React.createRef<HTMLDivElement>()
    private unsubscribe?: () => void
    private mounted = false

    constructor(props: object) {
      super(props)
      this.onClear = this.onClear.bind(this)
      this.onMouseEnter = this.onMouseEnter.bind(this)
      this.onMouseLeave = this.onMouseLeave.bind(this)
      this.state = { logs: [], hover: false }
    }

    override componentDidMount() {
      this.mounted = true
      this.unsubscribe = subscribe(log => this.add(log))
    }

    add(log: Log) {
      if (!this.mounted)
        return
      this.setState(state => ({ logs: [...state.logs, log] }))
      const element = this.consoleRef.current
      if (!this.state.hover && element) {
        if (this.scrollTimer !== null)
          window.clearTimeout(this.scrollTimer)
        this.scrollTimer = window.setTimeout(() => {
          this.scrollTimer = null
          if (this.mounted && this.consoleRef.current === element)
            element.scrollTop = element.scrollHeight
        }, 200)
      }
    }

    onClear() { this.setState({ logs: [] }) }
    onMouseEnter() { this.setState({ hover: true }) }
    onMouseLeave() { this.setState({ hover: false }) }

    override componentWillUnmount() {
      this.mounted = false
      this.unsubscribe?.()
      this.unsubscribe = undefined
      if (this.scrollTimer !== null)
        window.clearTimeout(this.scrollTimer)
      this.scrollTimer = null
    }

    override render() {
      const count = React.createElement('span', { className: 'console-header-number' }, this.state.logs.length)
      const title = React.createElement('div', { className: 'console-header-left' }, 'Console', ' ', count)
      const clear = React.createElement('div', { className: 'console-header-right', onClick: this.onClear }, 'Clear')
      const header = React.createElement('div', { className: 'console-header' }, title, clear)
      const logs = React.createElement(feed.Console, { logs: this.state.logs, variant: 'dark' })
      const content = React.createElement('div', { ref: this.consoleRef, className: 'console-component', onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave }, logs)
      return React.createElement(Container, null, header, content)
    }
  }
}
