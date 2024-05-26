import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { Parcel } from '@parcel/core';

const basePath = 'packages/artplayer';

const entries = glob.sync(path.join(basePath, 'src/i18n/*.js'), {
    ignore: [path.join(basePath, 'src/i18n/index.js'), path.join(basePath, 'src/i18n/zh-cn.js')],
});

const packagePath = path.join(basePath, 'package.json');
const backupPackagePath = path.join(basePath, 'package_backup.json');

(async function build() {
    fs.renameSync(packagePath, backupPackagePath);

    const bundler = new Parcel({
        entries: entries,
        defaultConfig: '@parcel/config-default',
        mode: 'production',
        defaultTargetOptions: {
            distDir: 'packages/artplayer/dist/i18n',
            outputFormat: 'global',
            sourceMaps: false,
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
        fs.renameSync(backupPackagePath, packagePath);
    } catch (err) {
        console.log(err.diagnostics);
        fs.renameSync(backupPackagePath, packagePath);
    }
})();
