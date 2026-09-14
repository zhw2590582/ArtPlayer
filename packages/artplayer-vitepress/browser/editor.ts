import type { EditorHost } from './editor-host.ts'
import { createFileImports } from './editor-files.ts'
import { createMonaco } from './editor-monaco.ts'
import { readPreference, writePreference } from './editor-preferences.ts'
import { createEditorSession, executeClassic } from './editor-session.ts'

export async function installEditor(host: EditorHost): Promise<void> {
  const document = host.document
  const element = <T extends HTMLElement>(selector: string): T => {
    const node = document.querySelector<T>(selector)
    if (!node)
      throw new Error(`Missing editor element: ${selector}`)
    return node
  }
  host.Artplayer.DEBUG = true
  if (host.Artplayer.utils.isMobile) {
    host.location.href = `./mobile.html${host.location.search}`
    return
  }
  const run = element<HTMLButtonElement>('.run')
  const libs = element<HTMLTextAreaElement>('.libsInput')
  const file = element<HTMLInputElement>('#file')
  const popup = element<HTMLDivElement>('.popups')
  const output = element<HTMLDivElement>('.console')
  host.consoleLog(output)
  const controller = new AbortController()
  const cleanups: (() => void)[] = []
  cleanups.push(() => {
    host.consoleLog.unmount?.(output)
  })
  const listen = (
    target: EventTarget,
    type: string,
    callback: EventListener,
  ) => {
    target.addEventListener(type, callback)
    cleanups.push(() => target.removeEventListener(type, callback))
  }
  const report = (error: unknown) => {
    if (!controller.signal.aborted)
      host.console.error(error)
  }
  listen(host, 'error', event => host.console.error(event))
  listen(host, 'unhandledrejection', event => host.console.error(event))
  for (const key of ['prod', 'ts', 'code', 'log'] as const) {
    const checkbox = element<HTMLInputElement>(`#${key}`)
    checkbox.checked = readPreference(key, () => host.localStorage)
    listen(checkbox, 'change', () => {
      if (writePreference(key, checkbox.checked, () => host.localStorage)) {
        host.location.reload()
      }
      else {
        checkbox.checked = readPreference(key, () => host.localStorage)
        report(
          new Error('Browser storage is unavailable; preference was not saved'),
        )
      }
    })
  }
  if (element<HTMLInputElement>('#code').checked)
    element('#editor').style.display = 'none'
  if (element<HTMLInputElement>('#log').checked)
    output.style.display = 'none'
  const imports = createFileImports(document, (name) => {
    libs.value = `[${name}]`
  })
  cleanups.push(() => imports.dispose())
  cleanups.push(() => {
    host.dispatchEvent(new Event('artplayer:example:cleanup'))
    for (const art of host.Artplayer.instances.slice()) {
      try {
        art.destroy(true)
      }
      catch (error) {
        host.console.error(error)
      }
    }
    host.art = undefined
  })
  listen(file, 'change', () => {
    void imports.add(Array.from(file.files || [])).catch(report)
  })
  listen(popup, 'click', (event) => {
    if (event.target === popup)
      popup.style.display = 'none'
  })
  const onPageHide = (event: PageTransitionEvent) => {
    if (event.persisted)
      return
    controller.abort()
    for (const cleanup of cleanups.reverse()) {
      try {
        cleanup()
      }
      catch (error) {
        host.console.error(error)
      }
    }
  }
  host.addEventListener('pagehide', onPageHide)
  cleanups.push(() => host.removeEventListener('pagehide', onPageHide))
  run.setAttribute('aria-disabled', 'true')
  try {
    const monaco = await createMonaco(
      host,
      element('.codeMirrorWrap'),
      element<HTMLInputElement>('#ts').checked,
      controller.signal,
    )
    const session = createEditorSession({
      loadLibraries: (encoded) => {
        libs.value = decodeURIComponent(encoded)
        return host.ArtplayerDocsLoader.loadLibraries(encoded)
      },
      exampleSource: name => host.ArtplayerDocsLoader.exampleSource(name),
      writeCode: code => monaco.editor.setValue(code),
      compile: monaco.compile,
      execute: (code) => {
        host.dispatchEvent(new Event('artplayer:example:cleanup'))
        for (const art of host.Artplayer.instances.slice()) art.destroy(true)
        executeClassic(code)
        host.art = host.Artplayer.instances[0]
      },
    })
    cleanups.push(() => session.dispose(), monaco.dispose)
    function restart() {
      const code = encodeURIComponent(monaco.editor.getValue())
      const dependencies = encodeURIComponent(libs.value)
      host.history.pushState(
        null,
        '',
        `${host.location.origin}${host.location.pathname}?libs=${dependencies}&code=${code}`,
      )
      void session.run({ libs: dependencies, code }).catch(report)
    }
    listen(run, 'click', restart)
    listen(document, 'keydown', (event) => {
      const key = event as KeyboardEvent
      if ((key.ctrlKey || key.metaKey) && key.key === 's') {
        key.preventDefault()
        restart()
      }
    })
    run.removeAttribute('aria-disabled')
    await session.run(host.ArtplayerDocsLoader.parameters(host.location.href))
  }
  catch (error) {
    report(error)
  }
}

// HTML bootstraps the existing player, Monaco AMD loader and console bridge before this entry.
void installEditor(window as unknown as EditorHost).catch(error =>
  console.error(error),
)
