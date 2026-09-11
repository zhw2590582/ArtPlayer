import type { I18n } from './i18n.js'

declare const language: NonNullable<I18n['en']>
// eslint-disable-next-line no-restricted-syntax -- Preserve the language object's CommonJS value export.
export = language
