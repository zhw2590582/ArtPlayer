import type Setting from './setting'
import type { DanmuInput } from './types'

export async function emitSetting(setting: Setting) {
  const { lifecycle, template: { $input } } = setting
  if (!lifecycle.active)
    return
  const text = $input.value.trim()
  if (!text.length || setting.isLock || setting.emitting)
    return
  const danmu: DanmuInput = {
    text,
    mode: setting.option.mode,
    color: setting.option.color,
    time: setting.art.currentTime,
  }
  const report = (error: unknown) => {
    if (lifecycle.active)
      console.error('Error emitting danmuku:', error)
  }
  try {
    setting.emitting = true
    const state = await lifecycle.wait(setting.option.beforeEmit(danmu))
    if (!lifecycle.active)
      return
    setting.emitting = false
    if (state !== true)
      return
    danmu.border = true
    delete danmu.time
    // emit inserts synchronously; observe its Promise without delaying the UI.
    Promise.resolve(setting.danmuku.emit(danmu)).catch(report)
    if (!lifecycle.active)
      return
    $input.value = ''
    setting.lock()
  }
  catch (error) {
    report(error)
    if (lifecycle.active)
      setting.emitting = false
  }
}

export function lockSetting(setting: Setting) {
  if (!setting.lifecycle.active)
    return
  const { addClass } = setting.utils
  const { $send } = setting.template
  clearTimeout(setting.timer as number | undefined)
  setting.isLock = true
  let time = setting.option.lockTime
  $send.textContent = time as unknown as string
  addClass($send, 'apd-lock')
  const loop = () => {
    setting.timer = setTimeout(() => {
      if (!setting.lifecycle.active)
        return
      if (time === 0) {
        setting.unlock()
      }
      else {
        time -= 1
        $send.textContent = time as unknown as string
        loop()
      }
    }, 1000)
  }
  loop()
}

export function unlockSetting(setting: Setting) {
  clearTimeout(setting.timer as number | undefined)
  setting.timer = null
  setting.isLock = false
  if (!setting.lifecycle.active)
    return
  const { removeClass } = setting.utils
  const { $send } = setting.template
  $send.textContent = '发送'
  removeClass($send, 'apd-lock')
}
