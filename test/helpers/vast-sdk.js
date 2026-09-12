// Controlled wrapper boundary, not an implementation of Google IMA or media playback.
// Self-contained so the same recorder can run in Node and a real browser realm.
export function createVastSdk(options = {}) {
  const state = { players: [], loads: 0, errors: [], ...options }
  let resolveLoad
  let rejectLoad
  const pending = new Promise((resolve, reject) => {
    resolveLoad = resolve
    rejectLoad = reject
  })
  const ima = { AdsRenderingSettings: class {}, AdsRequest: class {} }
  const sdk = {
    loadImaSdk() {
      state.loads++
      return state.deferLoad ? pending : Promise.resolve(ima)
    },
    PlayerOptions: class {},
    Player: class {
      constructor(...args) {
        if (state.constructError)
          throw state.constructError
        this.args = args
        this.requests = []
        this.listeners = new Map()
        this.destroyCalls = 0
        state.players.push(this)
      }

      addEventListener(name, callback) {
        if (state.listenError)
          throw state.listenError
        if (!this.listeners.has(name))
          this.listeners.set(name, new Set())
        this.listeners.get(name).add(callback)
      }

      removeEventListener(name, callback) {
        this.listeners.get(name)?.delete(callback)
      }

      emit(name, detail) {
        for (const callback of [...(this.listeners.get(name) || [])]) callback({ type: name, detail })
      }

      playAds(request) {
        if (state.playError)
          throw state.playError
        this.requests.push(request)
      }

      destroy() {
        this.destroyCalls++
        if (state.destroyError)
          throw state.destroyError
        this.listeners.clear()
      }
    },
  }
  return { state, sdk, ima, resolveLoad: () => resolveLoad(ima), rejectLoad }
}
