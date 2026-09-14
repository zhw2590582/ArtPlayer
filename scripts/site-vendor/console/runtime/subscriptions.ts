import type { Clock, ConsoleTarget, Log, NativeMethod, Parser } from './types.ts'
import { errorArgument } from './errors.ts'

interface Listener { callback?: (log: Log) => void }
interface SavedMethod { name: string, descriptor?: PropertyDescriptor, wrapper: NativeMethod }
interface Owner {
  listeners: Set<Listener>
  pending: Set<number>
  saved: SavedMethod[]
  feed: { pointers: Record<string, unknown>, src: { npm: string, github: string } }
  previousFeed?: PropertyDescriptor
}

export function createSubscriptions(target: ConsoleTarget, methods: string[], parse: Parser, clock: Clock) {
  let owner: Owner | undefined

  function restore(current: Owner) {
    for (const timer of current.pending)
      clock.clearTimeout(timer)
    current.pending.clear()
    for (const saved of current.saved) {
      if (target[saved.name] !== saved.wrapper)
        continue
      if (saved.descriptor)
        Object.defineProperty(target, saved.name, saved.descriptor)
      else
        delete target[saved.name]
    }
    if (target.feed === current.feed) {
      if (current.previousFeed)
        Object.defineProperty(target, 'feed', current.previousFeed)
      else
        delete target.feed
    }
  }

  return (callback: (log: Log) => void) => {
    if (!owner) {
      const current: Owner = {
        listeners: new Set(),
        pending: new Set(),
        saved: [],
        previousFeed: Object.getOwnPropertyDescriptor(target, 'feed'),
        feed: { pointers: {}, src: { npm: 'https://npmjs.com/package/console-feed', github: 'https://github.com/samdenty99/console-feed' } },
      }
      owner = current
      try {
        for (const name of methods) {
          const original = target[name] as NativeMethod
          const wrapper: NativeMethod = function (...args) {
            Reflect.apply(original, this, args)
            const listeners = [...current.listeners]
            if (!listeners.length)
              return
            const timer = clock.setTimeout(() => {
              current.pending.delete(timer)
              const log = parse(name, name === 'error' ? args.map(errorArgument) : args)
              if (log) {
                let failed = false
                let failure: unknown
                for (const listener of listeners) {
                  try {
                    listener.callback?.(log)
                  }
                  catch (error) {
                    if (!failed) {
                      failed = true
                      failure = error
                    }
                    else {
                      clock.setTimeout(() => {
                        throw error
                      }, 0)
                    }
                  }
                }
                if (failed)
                  throw failure
              }
            }, 0)
            current.pending.add(timer)
          }
          current.feed.pointers[name] = original
          current.saved.push({ name, descriptor: Object.getOwnPropertyDescriptor(target, name), wrapper })
          target[name] = wrapper
        }
        target.feed = current.feed
      }
      catch (error) {
        restore(current)
        owner = undefined
        throw error
      }
    }
    const current = owner
    const listener: Listener = { callback }
    current.listeners.add(listener)
    return () => {
      listener.callback = undefined
      current.listeners.delete(listener)
      if (!current.listeners.size && owner === current) {
        owner = undefined
        restore(current)
      }
    }
  }
}
