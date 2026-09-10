import type { Dictionary, Languages } from './publish'
import { has, mergeDeep } from '../utils/property'
import zhCn from './zh-cn'

export interface I18nHost {
  option: { lang: string, i18n: Languages }
}

export default class I18n {
  declare art: I18nHost
  declare languages: Languages
  declare language: Dictionary

  constructor(art: I18nHost) {
    this.art = art
    this.languages = { 'zh-cn': zhCn }
    this.language = {}
    this.update(art.option.i18n)
  }

  init(): void {
    const lang = this.art.option.lang.toLowerCase()
    this.language = (has(this.languages, lang) && this.languages[lang]) || {}
  }

  get(key: string): string {
    return (has(this.language, key) && this.language[key]) || key
  }

  update(value: Languages): void {
    this.languages = mergeDeep(this.languages, value)
    this.init()
  }
}
