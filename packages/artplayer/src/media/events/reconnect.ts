import type ResourceScope from '../../lifecycle/scope'
import type { MediaEventHost, Reconnect } from './types'
import { isClosing } from '../../lifecycle/instance'
import { wait } from '../../lifecycle/resources'
import { assignUrl, beginSource, getSourceScope } from '../../source/operation'
import { addClass, removeClass } from '../../utils'
import { showMediaUI } from './listen'

export function createReconnect(art: MediaEventHost): Reconnect {
  const { option, constructor, i18n, notice, template: { $player } } = art
  let source = getSourceScope(art)
  let attempts = 0
  let pending: ResourceScope | undefined

  const run = async (error: unknown) => {
    if (isClosing(art))
      return
    const current = getSourceScope(art)
    if (current !== source) {
      source = current
      attempts = 0
    }
    if (pending && !pending.closed)
      return
    const attempt = current.child()
    pending = attempt
    attempt.add(() => {
      if (pending === attempt)
        pending = undefined
    })
    const active = () => !isClosing(art) && !attempt.closed && current === getSourceScope(art)
    const retry = attempts < constructor.RECONNECT_TIME_MAX
    try {
      if (!retry) {
        showMediaUI(art, [['mask', true], ['loading', false], ['controls', true]], active)
        if (!active())
          return
        addClass($player, 'art-error')
      }
      if (!await wait(attempt, constructor.RECONNECT_SLEEP_TIME) || !active())
        return
      if (retry) {
        const url = option.url
        if (!active())
          return
        attempts += 1
        const attemptNumber = attempts
        // End the old timer before creating the retry's new source generation.
        attempt.dispose()
        const operation = beginSource(art)
        source = getSourceScope(art)
        assignUrl(art, operation, url)
        if (!operation.active())
          return
        const message = `${i18n.get('Reconnect')}: ${attemptNumber}`
        if (!operation.active())
          return
        notice.show = message
        if (operation.active())
          art.emit('error', error, attemptNumber)
      }
      else {
        const message = i18n.get('Video Load Failed')
        if (active())
          notice.show = message
      }
    }
    finally {
      attempt.dispose()
    }
  }

  return {
    reset() {
      attempts = 0
      pending?.dispose()
      removeClass($player, 'art-error')
    },
    loadStart() {
      removeClass($player, 'art-error')
    },
    schedule(error) {
      void run(error).catch((failure) => {
        console.warn('ArtPlayer reconnect failed:', failure)
      })
    },
  }
}
