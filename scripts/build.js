import fs from 'fs';
import cpy from 'cpy';
import path from 'path';
import prompts from 'prompts';
import { Parcel } from '@parcel/core';
import { getProjects, injectPlaceholders } from './utils.js';

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
            isLibrary: true,
            engines: {
                browsers: 'last 1 Chrome version',
            },
        },
        legacy: {
            context: 'browser',
            distDir: path.join(projects[name], 'dist'),
            sourceMap: false,
            outputFormat: 'global',
            isLibrary: true,
            engines: {
                browsers: 'IE 11',
            },
        },
        esm: {
            context: 'browser',
            distDir: path.join(projects[name], 'dist'),
            sourceMap: true,
            outputFormat: 'esmodule',
            isLibrary: true,
            engines: {
                browsers: 'last 1 Chrome version',
            },
        },
    };

    const names = {
        main: name,
        legacy: `${name}.legacy`,
        esm: `${name}.esm`,
    };

    const entryFile = path.join(projects[name], 'src/index.js');
    const restorePlaceholders = injectPlaceholders(entryFile, {
        __APP_VERSION__: `"${version}"`,
        __NODE_ENV__: `"production"`,
    });

    const bundler = new Parcel({
        entries: entryFile,
        defaultConfig: '@parcel/config-default',
        mode: 'production',
        targets: {
            [targetName]: targets[targetName],
        },
        env: {
            NODE_ENV: 'production',
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
        const size = fs.statSync(newFilePath).size / 1024;
        await cpy(newFilePath, compiledPath);

        if (targetName === 'esm') {
            const jsFile = path.join(projects[name], `dist/${names.esm}.js`);
            const oldMapName = 'index.js.map';
            const newMapName = `${names.esm}.js.map`;

            const oldMapPath = path.join(projects[name], 'dist', oldMapName);
            const newMapPath = path.join(projects[name], 'dist', newMapName);
            if (fs.existsSync(oldMapPath)) {
                fs.renameSync(oldMapPath, newMapPath);
            }

            let jsContent = fs.readFileSync(jsFile, 'utf8');
            jsContent = jsContent.replace(/\/\/# sourceMappingURL=.*\.js\.map/, `\n//# sourceMappingURL=${newMapName}`);
            fs.writeFileSync(jsFile, jsContent);
            await cpy(newMapPath, compiledPath);
            await cpy(newFilePath, compiledPath);
        }

        console.log(
            `✨ Built@${targetName} ${name}@${version}`,
            `Bundles@${bundles.length}`,
            `Time@${buildTime}ms`,
            `Size@${size.toFixed(2)}kb`,
        );
    } catch (error) {
        console.error(`❌ Failed to build ${name}:`, error);
    } finally {
        restorePlaceholders();
    }
}

async function runBuild() {
    if (process.argv.pop() === 'all') {
        const bundles = Object.keys(projects).map((name) => async () => {
            await build(name, 'main');
            await build(name, 'legacy');
            await build(name, 'esm');
        });

        await runPromisesInSeries(bundles);
        console.log('✅ Finished building all packages!');
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
            await build(response.value, 'esm');
        }
    }
}

function runPromisesInSeries(ps) {
    return ps.reduce((p, next) => p.then(next), Promise.resolve());
}

runBuild().catch((error) => {
    console.error('❌ Build script encountered an error:', error);
});
