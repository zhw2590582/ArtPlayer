import { generateSW } from 'workbox-build';

generateSW({
    globDirectory: 'docs/',
    globPatterns: ['assets/**/*.{css,woff2,png,svg,jpg,js}'],
    swDest: 'docs/sw.js',
    sourcemap: false,
}).then(({ count, size, warnings }) => {
    if (warnings.length > 0) {
        console.warn('Warnings encountered while generating a service worker:', warnings.join('\n'));
    }
    console.log(`✨ Generated a service worker, which will precache ${count} files, totaling ${size} bytes.`);
});
