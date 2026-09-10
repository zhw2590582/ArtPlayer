import type Artplayer from 'artplayer'
import chapter from 'artplayer-plugin-chapter'

declare const art: Artplayer
chapter()
chapter(undefined)
chapter({})
chapter({ chapters: [] })(art).update({})
const name: 'artplayerPluginChapter' = chapter()(art).name
void name
// @ts-expect-error The update object remains required.
chapter()(art).update()
// @ts-expect-error A chapter title remains a string.
chapter({ chapters: [{ start: 0, end: 1, title: 12 }] })
// @ts-expect-error null is not an options object.
chapter(null)
