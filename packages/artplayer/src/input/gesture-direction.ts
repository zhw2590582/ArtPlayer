export function slideDirection(startX: number, startY: number, endX: number, endY: number): 0 | 1 | 2 | 3 | 4 {
  const dy = startY - endY
  const dx = endX - startX
  if (Math.abs(dx) < 2 && Math.abs(dy) < 2)
    return 0
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  if (angle >= -45 && angle < 45)
    return 4
  if (angle >= 45 && angle < 135)
    return 1
  if (angle >= -135 && angle < -45)
    return 2
  if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135))
    return 3
  return 0
}
