import type ResourceScope from '../lifecycle/scope'
import { getScope } from '../lifecycle/instance'
import SubtitleRequest from './request'

export interface SubtitleState {
  scope: ResourceScope
  request?: SubtitleRequest
  track?: ResourceScope
  ownedURL?: string
  revision: number
  render: number
  trackRevision: number
}

const states = new WeakMap<object, SubtitleState>()

export function initSubtitleState(subtitle: object, art: object): SubtitleState {
  const scope = getScope(art).child()
  const state: SubtitleState = { scope, revision: 0, render: 0, trackRevision: 0 }
  states.set(subtitle, state)
  scope.add(() => {
    releaseSubtitleURL(state)
  })
  return state
}

export function subtitleState(subtitle: object): SubtitleState {
  return states.get(subtitle)!
}

export function beginSubtitleRequest(state: SubtitleState): SubtitleRequest {
  const previous = state.request
  const request = new SubtitleRequest(state.scope)
  state.request = request
  state.revision += 1
  previous?.cancel()
  return request
}

export function releaseSubtitleURL(state: SubtitleState): void {
  const url = state.ownedURL
  state.ownedURL = undefined
  if (url)
    URL.revokeObjectURL(url)
}
