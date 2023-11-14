import LibassAdapter from './adapter'

function checkVersion(art) {
    const {
        version,
        utils: { errorHandle },
    } = art.constructor
    const arr = version.split('.').map(Number)
    const major = arr[0]
    const minor = arr[1] / 100
    errorHandle(
        major + minor >= 5,
        `Artplayer.js@${version} is not compatible the artplayerPluginLibass@${artplayerPluginLibass.version}. Please update it to version Artplayer.js@5.x.x`,
    )
}

export default function artplayerPluginLibass(option) {
    return (art) => {
        checkVersion(art)

        let adapter = new LibassAdapter(art, option)

        return {
            name: 'artplayerPluginLibass',
            libass: adapter.libass,
            visible: adapter.visible,
            init: adapter.init.bind(adapter),
            switch: adapter.switch.bind(adapter),
            show: adapter.show.bind(adapter),
            hide: adapter.hide.bind(adapter),
            destroy: adapter.destroy.bind(adapter),
        }
    }
}

artplayerPluginLibass.env = process.env.NODE_ENV
artplayerPluginLibass.version = process.env.APP_VER
artplayerPluginLibass.build = process.env.BUILD_DATE

if (typeof window !== 'undefined') {
    window['artplayerPluginLibass'] = artplayerPluginLibass
}
