import type { I18n } from 'artplayer'
import french from 'artplayer/i18n/fr'

const dictionary: NonNullable<I18n['en']> = french
const close: string | undefined = french.Close
// @ts-expect-error Translation values cannot be numbers.
const numeric: number = french.Close
// @ts-expect-error Language values do not have a permissive arbitrary-key index.
const missing = french.notATranslation
void [dictionary, close, numeric, missing]
