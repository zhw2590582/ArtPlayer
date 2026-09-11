interface StyledElement { style: CSSStyleDeclaration }

export function setStyle<T extends StyledElement>(element: T, key: PropertyKey, value: unknown): T {
  // Preserve bracket assignment, including native conversion and thrown setters.
  const style = element.style as unknown as Record<PropertyKey, unknown>
  style[key] = value
  return element
}

export function setStyles<T extends StyledElement>(element: T, styles: object): T {
  for (const key in styles)
    setStyle(element, key, (styles as Record<string, unknown>)[key])
  return element
}

export function getStyle(element: Element, key: string, numberType?: true): number
export function getStyle(element: Element, key: string, numberType: false): string
export function getStyle(element: Element, key: string, numberType: boolean): number | string
export function getStyle(element: Element, key: string, numberType = true): number | string {
  const value = window.getComputedStyle(element, null).getPropertyValue(key)
  return numberType ? Number.parseFloat(value) : value
}
