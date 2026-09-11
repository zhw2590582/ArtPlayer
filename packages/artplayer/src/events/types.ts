import type { GestureHost } from '../input/gesture-types'
import type { ClickHost, HoverHost, MoveHost } from '../input/pointer-types'
import type { GlobalEventHost } from './global-types'
import type { RafHost, ResizeHost, ViewHost } from './scheduling-types'

export type EventsHost = ClickHost & HoverHost & MoveHost & GestureHost & GlobalEventHost & RafHost & ResizeHost & ViewHost
