import type { SubscriptionHost } from '../component/resources'
import { getScope, isClosing } from '../lifecycle/instance'

export function eventSubscriptions<Events extends { [Name in keyof Events]: readonly unknown[] }>(art: SubscriptionHost<Events>) {
  return <Name extends keyof Events>(name: Name, callback: (...args: [...Events[Name]]) => unknown): void => {
    if (isClosing(art))
      return
    const listener = (...args: [...Events[Name]]) => {
      if (!isClosing(art))
        return callback(...args)
    }
    art.on(name, listener)
    getScope(art).add(() => {
      art.off(name, listener)
    })
  }
}
