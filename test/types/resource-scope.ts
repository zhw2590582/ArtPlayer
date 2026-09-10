import { animationFrame, listen, objectURL, requestController, timeout } from '../../packages/artplayer/src/lifecycle/resources'
import ResourceScope from '../../packages/artplayer/src/lifecycle/scope'

const instance = new ResourceScope()
const operation = instance.child()
operation.add(() => {
  document.body.removeAttribute('data-test')
})
timeout(operation, () => {}, 10)
animationFrame(operation, time => time.toFixed())
listen(operation, document, 'click', { handleEvent(event) {
  event.preventDefault()
} })
const url: string = objectURL(operation, new Blob())
const signal: AbortSignal | undefined = requestController(operation)?.signal
void [url, signal]
// @ts-expect-error Cleanup is synchronous; async work needs a separately awaited owner.
operation.add(async () => {})
// @ts-expect-error A cleanup cannot return a timer handle.
operation.add(() => 1)
// @ts-expect-error Delays must be numeric.
timeout(operation, () => {}, '10')
// @ts-expect-error Object URLs require a Blob.
objectURL(operation, 'existing-url')
instance.dispose()
