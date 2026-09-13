import type Artplayer from '../../packages/artplayer/public/artplayer.ts'
import type { DocumentationExample } from './parser.ts'

interface FrameWindow extends Window {
  Artplayer?: typeof Artplayer
  eval: (code: string) => unknown
}
export interface SmokeResult {
  id: string
  instances: number
  ready: number
  media: { readyState: number, width: number, height: number, duration: number }[]
}

let running = false

/** Evaluate one example in an owned browsing context; readiness is not feature acceptance. */
export async function runExample(
  example: DocumentationExample,
  scripts: string[],
  timeoutMs = 4500,
): Promise<SmokeResult> {
  if (running)
    throw new Error('Documentation smoke cases must run sequentially')
  const savedStorage = [localStorage, sessionStorage].map(storage => ({ storage, entries: Object.entries(storage) }))
  const iframe = document.createElement('iframe')
  iframe.dataset.documentationSmoke = example.id
  iframe.title = `Documentation smoke: ${example.id}`
  iframe.style.cssText = 'width:640px;height:360px;border:0;display:block'
  const context: { frame: FrameWindow | null } = { frame: null }
  let active = true
  const disposers: (() => void)[] = []
  let fail: (error: unknown) => void = () => {}
  const failure = new Promise<never>((_resolve, reject) => {
    fail = reject
  })
  const deadline = window.setTimeout(
    () => fail(new Error(`${example.id}: readiness timeout (${timeoutMs}ms)`)),
    timeoutMs,
  )
  running = true
  const ensureActive = () => {
    if (!active)
      throw new Error('Documentation context was disposed')
  }
  function loaded(target: EventTarget, action: () => void, description: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const done = () => {
        cleanup()
        resolve()
      }
      const error = () => {
        cleanup()
        reject(new Error(`Failed to load ${description}`))
      }
      function cleanup() {
        target.removeEventListener('load', done)
        target.removeEventListener('error', error)
      }
      target.addEventListener('load', done, { once: true })
      target.addEventListener('error', error, { once: true })
      disposers.push(() => {
        cleanup()
        reject(new Error(`Cancelled ${description}`))
      })
      action()
    })
  }
  const work = async (): Promise<SmokeResult> => {
    await loaded(
      iframe,
      () => {
        iframe.srcdoc
          = '<!doctype html><html><body style="margin:0"><div class="artplayer-app" style="width:640px;height:360px"></div></body></html>'
        document.body.appendChild(iframe)
      },
      'documentation frame',
    )
    ensureActive()
    const frame = iframe.contentWindow as FrameWindow | null
    context.frame = frame
    if (!frame)
      throw new Error('Documentation frame is unavailable')
    const onError = (event: ErrorEvent) => {
      event.preventDefault()
      fail(new Error(`${example.id}: ${event.message}`))
    }
    const onRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      fail(new Error(`${example.id}: ${String(event.reason)}`))
    }
    frame.addEventListener('error', onError)
    frame.addEventListener('unhandledrejection', onRejection)
    disposers.push(() => {
      frame?.removeEventListener('error', onError)
      frame?.removeEventListener('unhandledrejection', onRejection)
    })
    for (const url of scripts) {
      const script = frame.document.createElement('script')
      script.src = new URL(url, location.href).href
      await loaded(script, () => frame.document.head.appendChild(script), script.src)
      ensureActive()
    }
    if (!frame.Artplayer)
      throw new Error('Artplayer was not loaded in the documentation frame')
    // Preserve classic-script globals while keeping timers, DOM and listeners inside this frame.
    await frame.eval(`${example.code}\n//# sourceURL=artplayer-doc-example-${encodeURIComponent(example.id)}.js`)
    ensureActive()
    const instances = frame.Artplayer.instances.slice()
    await Promise.all(
      instances.map(
        instance =>
          new Promise<void>((resolve, reject) => {
            if (instance.isReady) {
              resolve()
              return
            }
            const ready = () => {
              cleanup()
              resolve()
            }
            const error = () => {
              cleanup()
              reject(new Error(`${example.id}: player readiness failed`))
            }
            function cleanup() {
              instance.off('ready', ready)
              instance.off('error', error)
              instance.off('video:error', error)
            }
            instance.on('ready', ready)
            instance.on('error', error)
            instance.on('video:error', error)
            disposers.push(() => {
              cleanup()
              reject(new Error('Cancelled player readiness'))
            })
          }),
      ),
    )
    // A task boundary delivers unhandled promise rejections from evaluation/ready callbacks.
    await new Promise<void>((resolve) => {
      const timer = window.setTimeout(resolve, 0)
      disposers.push(() => window.clearTimeout(timer))
    })
    ensureActive()
    return {
      id: example.id,
      instances: instances.length,
      ready: instances.filter(instance => instance.isReady).length,
      media: instances.map(instance => ({
        readyState: instance.video.readyState,
        width: instance.video.videoWidth,
        height: instance.video.videoHeight,
        duration: instance.video.duration,
      })),
    }
  }
  let result: SmokeResult | undefined
  let problem: unknown
  let failed = false
  try {
    result = await Promise.race([work(), failure])
  }
  catch (error) {
    failed = true
    problem = error
  }
  finally {
    active = false
    window.clearTimeout(deadline)
    for (const dispose of disposers) dispose()
    const cleanupErrors: unknown[] = []
    for (const instance of context.frame?.Artplayer?.instances.slice() || []) {
      try {
        instance.destroy(true)
      }
      catch (error) {
        cleanupErrors.push(error)
      }
    }
    iframe.remove()
    for (const { storage, entries } of savedStorage) {
      try {
        storage.clear()
        for (const [key, value] of entries) storage.setItem(key, value)
      }
      catch (error) {
        cleanupErrors.push(error)
      }
    }
    running = false
    if (cleanupErrors.length) {
      const errors = failed ? [problem, ...cleanupErrors] : cleanupErrors
      problem = Object.assign(new Error(`Documentation cleanup failed: ${errors.map(String).join('; ')}`), { errors })
      failed = true
    }
  }
  if (failed)
    throw problem
  if (!result)
    throw new Error('Documentation smoke did not produce a result')
  return result
}

interface MochaHost {
  describe: (name: string, callback: (this: { timeout: (ms: number) => void }) => void) => void
  it: (name: string, callback: () => Promise<void>) => void
}

export function registerDocumentationSmoke(examples: DocumentationExample[], scripts: string[]): void {
  const host = globalThis as unknown as MochaHost
  if (typeof host.describe !== 'function' || typeof host.it !== 'function')
    throw new Error('Documentation smoke requires the existing Mocha BDD page')
  host.describe('Documentation readiness smoke (not feature acceptance)', function () {
    this.timeout(6000)
    for (const example of examples) {
      host.it(example.id, async () => {
        await runExample(example, scripts)
      })
    }
  })
}
