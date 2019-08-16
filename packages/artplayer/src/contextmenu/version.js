export default function version(menuOption) {
    return {
        ...menuOption,
        html: '<a href="https://artplayer.org" target="_blank">ArtPlayer __VERSION__</a>',
    };
}
