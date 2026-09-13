import type { DanmuItem, DanmuState } from './types'

interface QueueOwner { states: Record<DanmuState, DanmuItem[]>, art: { currentTime: number } }

export function filterState(owner: QueueOwner, state: DanmuState, callback: (danmu: DanmuItem) => void) {
  const danmus = owner.states[state] || []
  for (let index = 0; index < danmus.length; index++) callback(danmus[index]!)
  return danmus
}

export function readyItems(owner: QueueOwner) {
  const { currentTime } = owner.art
  const result: DanmuItem[] = []
  filterState(owner, 'ready', danmu => result.push(danmu))
  filterState(owner, 'wait', (danmu) => {
    if (currentTime + 0.1 >= danmu.time && danmu.time >= currentTime - 0.1)
      result.push(danmu)
  })
  return result
}

export function setItemState(owner: QueueOwner, danmu: DanmuItem, state: DanmuState) {
  owner.states[danmu.$state] = owner.states[danmu.$state].filter(item => item !== danmu)
  danmu.$state = state
  if (danmu.$ref)
    danmu.$ref.dataset.state = state
  owner.states[state].push(danmu)
}
