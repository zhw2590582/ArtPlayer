import { bilibiliDanmuParseFromUrl } from './bilibili'
import { isPromiseInput } from './config'

const inputs = new WeakMap()
const cancelled = Symbol('cancelled danmuku input')

function stateFor(owner) {
  if (!inputs.has(owner))
    inputs.set(owner, { closed: false, tasks: new Set(), emitting: [] })
  return inputs.get(owner)
}

export function inputActive(owner) {
  const state = stateFor(owner)
  const task = state.emitting[state.emitting.length - 1]
  return !state.closed && !owner.art.isDestroy && (!task || task.active())
}

export function beginInput(owner, replace) {
  const state = stateFor(owner)
  if (replace) {
    for (const task of [...state.tasks]) {
      if (task.replace)
        task.cancel()
    }
  }
  let stopped = state.closed || owner.art.isDestroy
  let resolveCancel
  const cancellation = new Promise(resolve => resolveCancel = resolve)
  const handlers = new Set()
  const controller = typeof AbortController === 'function' ? new AbortController() : undefined
  const task = {
    replace,
    signal: controller?.signal,
    active: () => !stopped && !state.closed && !owner.art.isDestroy,
    onCancel(callback) {
      if (!task.active()) {
        callback()
        return () => {}
      }
      handlers.add(callback)
      return () => handlers.delete(callback)
    },
    cancel() {
      if (stopped)
        return
      stopped = true
      resolveCancel(cancelled)
      controller?.abort()
      for (const callback of [...handlers]) callback()
      handlers.clear()
    },
    wait: value => Promise.race([value, cancellation]),
    emit(danmu) {
      state.emitting.push(task)
      try {
        return owner.emit(danmu)
      }
      finally {
        state.emitting.pop()
      }
    },
    finish() {
      state.tasks.delete(task)
      handlers.clear()
    },
  }
  if (stopped)
    resolveCancel(cancelled)
  else state.tasks.add(task)
  return task
}

export function cancelInputs(owner) {
  const state = stateFor(owner)
  state.closed = true
  for (const task of [...state.tasks]) task.cancel()
}

export function readInput(target, task) {
  if (typeof target === 'function')
    return { asynchronous: true, value: target() }
  if (isPromiseInput(target))
    return { asynchronous: true, value: target }
  if (typeof target === 'string')
    return { asynchronous: true, value: bilibiliDanmuParseFromUrl(target, task) }
  return { asynchronous: false, value: Array.isArray(target) ? target : [] }
}
