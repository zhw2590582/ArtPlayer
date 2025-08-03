export interface Subtitle {
  /**
   * The subtitle url
   */
  url?: string

  /**
   * The subtitle name
   */
  name?: string

  /**
   * The subtitle type
   */
  type?: 'vtt' | 'srt' | 'ass' | (string & Record<never, never>)

  /**
   * The subtitle style object
   */
  style?: Partial<CSSStyleDeclaration>

  /**
   * The subtitle encoding, default utf-8
   */
  encoding?: string

  /**
   * Whether use escape, default true
   */
  escape?: boolean

  /**
   * Change the vtt text
   */
  onVttLoad?: (vtt: string) => string
}
