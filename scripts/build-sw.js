const { generateSW } = require('workbox-build');

generateSW({
    globDirectory: 'docs/',
    globPatterns: ['assets/**/*.{css,woff2,png,svg,jpg,js}'],
    maximumFileSizeToCacheInBytes: 1024 * 1024 * 5,
    swDest: 'docs/sw.js',
    sourcemap: false,
}).then(({ count, size, warnings }) => {
    if (warnings.length > 0) {
        console.warn('Warnings encountered while generating a service worker:', warnings.join('\n'));
    }
    console.log(`Generated a service worker, which will precache ${count} files, totaling ${size} bytes.`);
});
