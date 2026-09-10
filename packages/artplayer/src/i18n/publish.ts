export type Dictionary = Record<string, string | undefined>
export type Languages = Record<string, Dictionary | undefined>

type LanguageGlobal = 'artplayer-i18n-ar' | 'artplayer-i18n-cs' | 'artplayer-i18n-es' | 'artplayer-i18n-fa' | 'artplayer-i18n-fr' | 'artplayer-i18n-id' | 'artplayer-i18n-pl' | 'artplayer-i18n-ru' | 'artplayer-i18n-tr' | 'artplayer-i18n-vi' | 'artplayer-i18n-zh-cn' | 'artplayer-i18n-zh-tw'

// Each standalone language keeps its historical browser alias, including ESM.
export function publishLanguage(name: LanguageGlobal, value: Dictionary): void {
  if (typeof window !== 'undefined') {
    const globals = window as Window & Partial<Record<LanguageGlobal, Dictionary>>
    globals[name] = value
  }
}
