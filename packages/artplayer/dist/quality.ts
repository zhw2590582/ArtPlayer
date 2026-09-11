export interface Quality {
  /**
   * Whether the default is selected
   */
  default?: boolean

  /**
   * Html string of quality
   */
  html: string | HTMLElement

  /**
   * Video quality url
   */
  url: string
}
