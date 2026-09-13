export interface VisibleDanmu {
  mode: number
  top: number
  left: number
  right: number
  height: number
  width: number
  speed: number
  distance: number
  time: number
}

export interface PlacementRequest {
  id?: number
  type: 'getDanmuTop'
  target: { mode: number, height: number, speed: number }
  visibles: VisibleDanmu[]
  clientWidth: number
  clientHeight: number
  marginBottom: number
  marginTop: number
  antiOverlap: boolean
}

export interface PlacementMessage extends PlacementRequest { id: number }
export interface PlacementReply { id: number, result: number | undefined }

export interface PlacementBoundary extends Omit<VisibleDanmu, 'mode' | 'time'> {
  type: 'top' | 'bottom'
}

export type PlacementRow = VisibleDanmu | PlacementBoundary
