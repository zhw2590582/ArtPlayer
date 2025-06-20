import { version } from '../../package.json';

export default function version(option) {
    return {
        ...option,
        html: `<a href="https://artplayer.org" target="_blank">ArtPlayer ${version}</a>`,
    };
}
