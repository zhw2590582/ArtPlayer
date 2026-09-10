import { errorHandle, silencePromise } from '../../packages/artplayer/src/utils/error'
import { getExt } from '../../packages/artplayer/src/utils/file'
import { def, has, mergeDeep } from '../../packages/artplayer/src/utils/property'
import { debounce, sleep, throttle } from '../../packages/artplayer/src/utils/time'

const pending: Promise<void> = sleep()
const extension: string = getExt('video.mp4')
const object = { count: 1 }
const same: typeof object = def(object, Symbol('metadata'), { value: 'value' })
const owns: boolean = has(object, 'count')
const merged: { count: number } = mergeDeep(object, { count: 2 })
const checked: typeof object = errorHandle(object, 'present')
const handled: Promise<number | undefined> = silencePromise(Promise.resolve(2))
function callback(this: { count: number }, increment: number) {
  return this.count + increment
}
for (const schedule of [debounce(callback, 10), throttle(callback, 10)]) {
  const result: void = schedule.call(object, 1)
  // @ts-expect-error Scheduled callbacks preserve argument types.
  schedule.call(object, '1')
  // @ts-expect-error Scheduled callbacks preserve receiver types.
  schedule.call({ count: '1' }, 1)
  // @ts-expect-error The callback result is not returned synchronously.
  const wrong: number = schedule.call(object, 1)
  void [result, wrong]
}
void [pending, extension, same, owns, merged, checked, handled]
