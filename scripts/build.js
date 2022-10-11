import fs from 'fs';
import cpy from 'cpy';
import path from 'path';
import prompts from 'prompts';
import { Parcel } from '@parcel/core';
import { formatDate, getProjects } from './utils.js';

const projects = getProjects();
const compiledPath = path.resolve(`docs/compiled`);

async function build(name, targetName) {
    const { version } = JSON.parse(fs.readFileSync(`${projects[name]}/package.json`, 'utf-8'));
    process.chdir(projects[name]);

    const targets = {
        main: {
            distDir: `${projects[name]}/dist`,
            sourceMap: false,
            outputFormat: 'global',
            engines: {
                browsers: 'last 1 Chrome version',
            },
        },
        legacy: {
            distDir: `${projects[name]}/dist`,
            sourceMap: false,
            outputFormat: 'global',
            engines: {
                browsers: '> 0.5%, last 2 versions, not dead',
            },
        },
    };

    const names = {
        main: name,
        legacy: `${name}.legacy`,
    };

    const bundler = new Parcel({
        entries: `${projects[name]}/src/index.js`,
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

    const banner =
        '/*!\n' +
        ` * ${name}.js v${version}\n` +
        ` * Github: https://github.com/zhw2590582/ArtPlayer\n` +
        ` * (c) 2017-${new Date().getFullYear()} Harvey Zack\n` +
        ' * Released under the MIT License.\n' +
        ' */\n';

    const { bundleGraph, buildTime } = await bundler.run();
    const bundles = bundleGraph.getBundles();

    const filePath = `${projects[name]}/dist/index.js`;
    const newFilePath = `${projects[name]}/dist/${names[targetName]}.js`;
    const code = banner + fs.readFileSync(filePath);
    fs.writeFileSync(filePath, code.replace(/\\n*\s*</g, '<').replace(/>\\n*\s*/g, '>'));
    fs.renameSync(filePath, newFilePath);
    await cpy(newFilePath, compiledPath);
    const size = fs.statSync(newFilePath).size / 1024;
    console.log(
        `✨ Built@${targetName} ${name}@${version}`,
        `Bundles@${bundles.length}`,
        `Time@${buildTime}ms`,
        `Size@${size}kb`,
    );
}

function runPromisesInSeries(ps) {
    return ps.reduce((p, next) => p.then(next), Promise.resolve());
}

if (process.argv.pop() === 'all') {
    const bundles = Object.keys(projects).map((name) => async () => {
        await build(name, 'main');
        await build(name, 'legacy');
    });

    runPromisesInSeries(bundles).then(() => {
        console.log(`✨ Finished building all packages!`);
    });
} else {
    (async () => {
        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'Which project do you want to build?',
            choices: Object.keys(projects).map((name) => {
                return {
                    title: name,
                    value: name,
                    description: projects[name],
                };
            }),
            initial: 0,
        });

        if (response.value) {
            await build(response.value, 'main');
            await build(response.value, 'legacy');
        }
    })();
}
