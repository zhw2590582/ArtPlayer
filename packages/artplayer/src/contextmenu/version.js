export default function version(option) {
    return {
        ...option,
        html: `<a href="https://artplayer.org" target="_blank">ArtPlayer</a>`,
        mounted(el) {
            const link = el.querySelector('a');
            const version = this.constructor.version;
            const ref = encodeURIComponent(location.href);
            link.textContent += ` ${version}`;
            link.href += `?ref=${ref}`;
        },
    };
}
