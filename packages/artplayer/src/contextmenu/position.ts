import type { ContextmenuHost } from './types'
import { isClosing } from '../lifecycle/instance'
import { getRect, setStyles } from '../utils'

export function positionContextmenu(art: ContextmenuHost, mouseX: number, mouseY: number): void {
  const { $player, $contextmenu } = art.template
  const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = getRect($player)
  const { height: mHeight, width: mWidth } = getRect($contextmenu)
  let menuLeft = mouseX - cLeft
  let menuTop = mouseY - cTop
  if (mouseX + mWidth > cLeft + cWidth)
    menuLeft = cWidth - mWidth
  if (mouseY + mHeight > cTop + cHeight)
    menuTop = cHeight - mHeight
  if (!isClosing(art))
    setStyles($contextmenu, { top: `${menuTop}px`, left: `${menuLeft}px` })
}
