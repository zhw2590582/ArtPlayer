import { createHash } from 'node:crypto'
import { build } from 'esbuild'
import { expect, test } from './fixtures.js'

// Explicit internal-source fixture, not evidence of an installed public API.
const fixture = await build({
  stdin: { contents: 'export { default as ResourceScope } from \'./packages/artplayer/src/lifecycle/scope\'; export * from \'./packages/artplayer/src/lifecycle/resources\'', resolveDir: process.cwd() },
  bundle: true,
  write: false,
  format: 'iife',
  globalName: 'ResourceFixture',
  target: 'es2015',
})

test('internal resource scope: native DOM, RAF, timer, fetch abort and URL release', async ({ page, browserName, diagnostics }, testInfo) => {
  await testInfo.attach('internal-source-fixture', { contentType: 'application/json', body: JSON.stringify({ kind: 'internal-source-fixture', target: 'es2015', sha256: createHash('sha256').update(fixture.outputFiles[0].text).digest('hex') }) })
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ content: fixture.outputFiles[0].text })
  const result = await page.evaluate(async () => {
    const { ResourceScope, listen, timeout, animationFrame, requestController, objectURL } = window.ResourceFixture
    const instance = new ResourceScope()
    const operation = instance.child()
    const button = document.createElement('button')
    document.body.append(button)
    const calls = []
    const options = { capture: true }
    listen(operation, button, 'click', function () {
      calls.push(this === button ? 'click' : 'wrong-receiver')
    }, options)
    options.capture = false
    button.click()
    const text = await (await fetch(objectURL(operation, new Blob(['scoped'])))).text()
    const revoked = objectURL(operation, new Blob(['revoked']))
    const before = await (await fetch(revoked)).text()
    const controller = requestController(operation)
    await new Promise(resolve => animationFrame(operation, (time) => {
      calls.push(typeof time)
      resolve()
    }))
    await new Promise(resolve => timeout(operation, () => {
      calls.push('timer')
      resolve()
    }, 0))
    animationFrame(operation, () => calls.push('cancelled-frame'))
    timeout(operation, () => calls.push('cancelled-timer'), 0)
    const pendingRequest = fetch('/test/pattern.mp4', { signal: controller.signal }).then(() => 'resolved', error => error.name)
    operation.dispose()
    button.click()
    // Await independent native scheduling turns so cancelled callbacks would be observable.
    await new Promise(resolve => requestAnimationFrame(resolve))
    await new Promise(resolve => setTimeout(resolve, 0))
    const abortName = await pendingRequest
    // Image caches may retain decoded pixels; a fresh fetch tests URL availability.
    let revokedError
    try {
      await fetch(revoked)
    }
    catch (error) { revokedError = error.name }
    button.remove()
    const instanceOpen = !instance.closed
    instance.dispose()
    return { text, before, calls, aborted: controller.signal.aborted, abortName, revokedError, instanceOpen, revoked, requestURL: new URL('/test/pattern.mp4', location.href).href }
  })
  const { revoked, requestURL, ...behavior } = result
  expect(behavior).toEqual({ text: 'scoped', before: 'revoked', calls: ['click', 'number', 'timer'], aborted: true, abortName: 'AbortError', revokedError: 'TypeError', instanceOpen: true })
  const expectedFailures = {
    chromium: [{ url: requestURL, resourceType: 'fetch', failure: { errorText: 'net::ERR_ABORTED' } }, { url: revoked, resourceType: 'fetch', failure: { errorText: 'net::ERR_FILE_NOT_FOUND' } }],
    firefox: [],
    webkit: [{ url: requestURL, resourceType: 'fetch', failure: { errorText: 'Load request cancelled' } }, { url: revoked, resourceType: 'fetch', failure: null }],
  }
  for (const failure of diagnostics.failedRequests)
    expect(expectedFailures[browserName]).toContainEqual(failure)
  const expectedConsole = { chromium: ['Failed to load resource: net::ERR_FILE_NOT_FOUND'], firefox: [], webkit: ['Failed to load resource'] }
  expect(diagnostics.consoleErrors).toEqual(expectedConsole[browserName])
})
