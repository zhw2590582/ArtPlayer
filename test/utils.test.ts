import type { Utils } from '../packages/artplayer/types/utils'

export function checkSilencePromiseTypes(utils: Utils, thenable: PromiseLike<number>) {
  const promise: Promise<number | undefined> = utils.silencePromise(Promise.resolve(42))
  const synchronous: undefined = utils.silencePromise(undefined)
  const unchanged: PromiseLike<number> = utils.silencePromise(thenable)
  // @ts-expect-error A catch-less thenable is not converted to a native Promise.
  utils.silencePromise(thenable).catch(() => {})
  return { promise, synchronous, unchanged }
}
