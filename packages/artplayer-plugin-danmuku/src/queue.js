export function filterState(owner, state, callback) {
  const danmus = owner.states[state] || []
  for (let index = 0; index < danmus.length; index++) callback(danmus[index])
  return danmus
}

export function readyItems(owner) {
  const { currentTime } = owner.art
  const result = []
  filterState(owner, 'ready', danmu => result.push(danmu))
  filterState(owner, 'wait', (danmu) => {
    if (currentTime + 0.1 >= danmu.time && danmu.time >= currentTime - 0.1)
      result.push(danmu)
  })
  return result
}

export function setItemState(owner, danmu, state) {
  owner.states[danmu.$state] = owner.states[danmu.$state].filter(item => item !== danmu)
  danmu.$state = state
  if (danmu.$ref)
    danmu.$ref.dataset.state = state
  owner.states[state].push(danmu)
}
