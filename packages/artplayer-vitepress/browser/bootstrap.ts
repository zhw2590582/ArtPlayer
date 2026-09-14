import { readPreference } from './editor-preferences.ts'

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const clear = () => {
      script.onload = null
      script.onerror = null
    }
    script.onload = () => {
      clear()
      resolve()
    }
    script.onerror = () => {
      clear()
      script.remove()
      reject(new Error(`Editor bootstrap failed: ${url}`))
    }
    script.src = url
    document.body.appendChild(script)
  })
}

async function bootstrap(): Promise<void> {
  await loadScript(
    readPreference('prod')
      ? './compiled/artplayer.js'
      : './uncompiled/artplayer/index.js',
  )
  await loadScript('./assets/js/vs/loader.js')
  await loadScript('./assets/js/common.js')
}

void bootstrap().catch(error => console.error(error))
