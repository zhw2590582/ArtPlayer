import Artplayer from 'artplayer'
import french from 'artplayer/i18n/fr'
const art = new Artplayer({ container: '#player', url: 'video.mp4', lang: 'fr', i18n: { fr: french } })
void art
