import type { Callbacks, Packet } from './requests'
import { childEnvelope, connectChildSession, consumeChildSession, prepareChildSession } from './child-session'
import { connect, releaseConnection } from './connection'
import { consumeNavigation, prepareNavigation } from './navigation'
import { acceptsMessage } from './protocol'
import { postRequest } from './requests'

export default class ArtplayerToolIframe {
  declare url: string
  declare $iframe: HTMLIFrameElement
  declare promises: Record<number, Callbacks>
  declare injected: boolean
  declare destroyed: boolean
  declare messageCallback: ((...args: any[]) => any) | null

  static get iframe() {
    return window.top !== window
  }

  static postMessage({ type, data, id = 0 }: Packet) {
    if (!ArtplayerToolIframe.iframe) {
      throw new Error('The "ArtplayerToolIframe.postMessage" method can only be used in iframe')
    }

    window.parent.postMessage(
      childEnvelope({
        type,
        data,
        id,
      }),
      '*',
    )
  }

  static async onMessage(event: MessageEvent<Packet>) {
    if (!ArtplayerToolIframe.iframe) {
      throw new Error('The "ArtplayerToolIframe.onMessage" method can only be used in iframe')
    }

    if (!acceptsMessage(event, window.parent) || consumeChildSession(event.data))
      return

    const { type, data, id } = event.data
    switch (type) {
      case 'commit':
        try {
          if (data.match(/\bresolve\((.*?)\)/)) {
            const string = `return new Promise(function(resolve){\n${data}\n})`
            // eslint-disable-next-line no-new-func
            const result = await new Function(string)()
            ArtplayerToolIframe.postMessage({ type: 'response', data: result, id })
          }
          else {
            // eslint-disable-next-line no-new-func
            const result = new Function(data)()
            ArtplayerToolIframe.postMessage({ type: 'response', data: result, id })
          }
        }
        catch (error) {
          ArtplayerToolIframe.postMessage({ type: 'error', data: (error as { message: string }).message, id })
          throw error
        }
        break
      default:
        break
    }
  }

  static inject() {
    if (!ArtplayerToolIframe.iframe) {
      throw new Error('The "ArtplayerToolIframe.inject" method can only be used in iframe')
    }

    prepareChildSession()
    ArtplayerToolIframe.postMessage({ type: 'inject' })
    connectChildSession(ArtplayerToolIframe.onMessage)
  }

  constructor({ iframe, url }: { iframe: HTMLIFrameElement, url: string }) {
    if (iframe instanceof HTMLIFrameElement === false) {
      throw new TypeError('"option.iframe" needs to be a HTMLIFrameElement')
    }

    if (typeof url !== 'string') {
      throw new TypeError('"option.url" needs to be a string')
    }

    this.url = url
    this.$iframe = iframe
    this.promises = {}
    this.injected = false
    this.destroyed = false
    this.messageCallback = () => null
    this.onMessage = this.onMessage.bind(this)
    try {
      connect(this)
    }
    catch (error) {
      this.destroyed = true
      try {
        releaseConnection(this)
      }
      catch {
        // Preserve the original setup failure if cleanup also fails.
      }
      throw error
    }
  }

  onMessage(event: MessageEvent<Packet>) {
    if (this.destroyed || !acceptsMessage(event, this.$iframe.contentWindow) || consumeNavigation(this, event.data))
      return

    const { type, data, id } = event.data

    switch (type) {
      case 'inject':
        this.injected = true
        break
      default:
        break
    }

    if (id !== undefined && Object.prototype.hasOwnProperty.call(this.promises, id) && this.promises[id]) {
      if (type === 'error') {
        this.promises[id]!.reject(new Error(data))
      }
      else {
        this.promises[id]!.resove(data)
      }
      delete this.promises[id]
    }

    if (this.messageCallback) {
      this.messageCallback({ type, data })
    }
  }

  postMessage(message: Packet): Promise<any> {
    prepareNavigation(this)
    return postRequest(this, message)
  }

  commit<T extends (...args: any[]) => any>(callback: T): Promise<ReturnType<T>> {
    if (typeof callback !== 'function') {
      throw new TypeError('"commit.callback" needs to be a function')
    }
    const callbackString = callback.toString()
    const bodyString = callbackString.substring(callbackString.indexOf('{') + 1, callbackString.lastIndexOf('}'))
    return this.postMessage({ type: 'commit', data: bodyString })
  }

  message(callback: (...args: any[]) => any) {
    if (typeof callback !== 'function') {
      throw new TypeError('"message.callback" needs to be a function')
    }
    this.messageCallback = callback
  }

  destroy() {
    this.destroyed = true
    releaseConnection(this)
  }
}
