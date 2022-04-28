export default function version(option) {
    return {
        ...option,
        html: `<a href="https://artplayer.org" target="_blank">ArtPlayer ${process.env.APP_VER}</a>`,
    };
}
