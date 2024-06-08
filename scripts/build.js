import fs from 'fs';
import cpy from 'cpy';
import path from 'path';
import prompts from 'prompts';
import { Parcel } from '@parcel/core';
import { formatDate, getProjects } from './utils.js';

const projects = getProjects();
const compiledPath = path.resolve('docs/compiled');

function compressString(input) {
    return input
        .replace(/\s*(<[^>]+>)\s*/g, '$1')
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function build(name, targetName) {
    const projectPackageJson = path.join(projects[name], 'package.json');
    const { version } = JSON.parse(fs.readFileSync(projectPackageJson, 'utf-8'));

    process.chdir(projects[name]);

    const targets = {
        main: {
            context: 'browser',
            distDir: path.join(projects[name], 'dist'),
            sourceMap: false,
            outputFormat: 'global',
            engines: {
                browsers: 'last 1 Chrome version',
            },
        },
        legacy: {
            context: 'browser',
            distDir: path.join(projects[name], 'dist'),
            sourceMap: false,
            outputFormat: 'global',
            engines: {
                browsers: 'IE 11',
            },
        },
    };

    const names = {
        main: name,
        legacy: `${name}.legacy`,
    };

    const bundler = new Parcel({
        entries: path.join(projects[name], 'src/index.js'),
        defaultConfig: '@parcel/config-default',
        mode: 'production',
        targets: {
            [targetName]: targets[targetName],
        },
        env: {
            NODE_ENV: 'production',
            APP_VER: version,
            BUILD_DATE: formatDate(Date.now()),
        },
    });

    const banner = `
/*!
 * ${name}.js v${version}
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-${new Date().getFullYear()} Harvey Zack
 * Released under the MIT License.
 */
`;

    try {
        const { bundleGraph, buildTime } = await bundler.run();
        const bundles = bundleGraph.getBundles();

        const filePath = path.join(projects[name], 'dist/index.js');
        const newFilePath = path.join(projects[name], `dist/${names[targetName]}.js`);
        const code = fs.readFileSync(filePath, 'utf-8');
        fs.writeFileSync(filePath, banner + compressString(code));
        fs.renameSync(filePath, newFilePath);
        await cpy(newFilePath, compiledPath);
        const size = fs.statSync(newFilePath).size / 1024;

        console.log(
            `✨ Built@${targetName} ${name}@${version}`,
            `Bundles@${bundles.length}`,
            `Time@${buildTime}ms`,
            `Size@${size.toFixed(2)}kb`,
        );
    } catch (error) {
        console.error(`Failed to build ${name}:`, error);
    }
}

async function runBuild() {
    if (process.argv.pop() === 'all') {
        const bundles = Object.keys(projects).map((name) => async () => {
            await build(name, 'main');
            await build(name, 'legacy');
        });

        await runPromisesInSeries(bundles);
        console.log('✨ Finished building all packages!');
    } else {
        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'Which project do you want to build?',
            choices: Object.keys(projects).map((name) => ({
                title: name,
                value: name,
            })),
            initial: 0,
        });

        if (response.value) {
            await build(response.value, 'main');
            await build(response.value, 'legacy');
        }
    }
}

function runPromisesInSeries(ps) {
    return ps.reduce((p, next) => p.then(next), Promise.resolve());
}

runBuild().catch((error) => {
    console.error('Build script encountered an error:', error);
});
