import path from 'path';
import { glob } from 'glob';
import { Parcel } from '@parcel/core';

const basePath = 'packages/artplayer/src/i18n';
const entries = glob.sync(
    path.join(basePath, '*.js'),
    {
        ignore: [
            path.join(basePath, 'index.js'),
            path.join(basePath, 'zh-cn.js'),
        ]
    }
);

(async function build() {
    const bundler = new Parcel({
        entries: entries,
        defaultConfig: '@parcel/config-default',
        mode: 'production',
        defaultTargetOptions: {
            distDir: 'packages/artplayer/dist/i18n',
            sourceMaps: false,
            outputFormat: 'global',
            isLibrary: true,
            engines: {
                browsers: ['last 1 Chrome version'],
            },
        },
        env: {
            NODE_ENV: 'production',
        },
    });

    try {
        const { bundleGraph, buildTime } = await bundler.run();
        const bundles = bundleGraph.getBundles();
        console.log(`✨ Built [i18n] ${bundles.length} bundles in ${buildTime}ms`);
    } catch (err) {
        console.log(err.diagnostics);
    }
})();