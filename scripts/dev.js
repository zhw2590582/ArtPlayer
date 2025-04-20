import fs from 'fs';
import path from 'path';
import servor from 'servor';
import prompts from 'prompts';
import { Parcel } from '@parcel/core';
import { fileURLToPath } from 'url';
import { getProjects, injectPlaceholders } from './utils.js';
import openBrowser from 'servor/utils/openBrowser.js';

const projects = getProjects();

async function develop(name) {
    const projectPath = projects[name];
    const uncompiledPath = path.resolve(`docs/uncompiled/${name}`);
    const entryFile = path.join(projectPath, 'src/index.js');
    const projectPackageJson = path.join(projectPath, 'package.json');
    const { version } = JSON.parse(fs.readFileSync(projectPackageJson, 'utf-8'));

    const restore = injectPlaceholders(entryFile, {
        __APP_VERSION__: `"${version}"`,
        __NODE_ENV__: `"development"`,
    });

    process.on('SIGINT', () => {
        restore();
        process.exit();
    });

    let isOpenBrowser = false;

    try {
        const { url } = await servor({
            root: 'docs',
            fallback: 'index.html',
            reload: true,
            port: 8082,
        });

        process.chdir(projectPath);

        const bundler = new Parcel({
            entries: entryFile,
            defaultConfig: '@parcel/config-default',
            mode: 'development',
            targets: {
                main: {
                    distDir: uncompiledPath,
                    outputFormat: 'global',
                    isLibrary: true,
                    engines: {
                        browsers: ['last 1 Chrome version'],
                    },
                },
            },
            env: {
                NODE_ENV: 'development',
            },
            additionalReporters: [
                {
                    packageName: '@parcel/reporter-cli',
                    resolveFrom: fileURLToPath(import.meta.url),
                },
            ],
        });

        bundler.watch((error, event) => {
            if (error) {
                console.error(`[${name}] ❌ Build error:`, error);
                return;
            }

            if (event.type === 'buildSuccess') {
                const bundles = event.bundleGraph.getBundles();
                console.log(`[${name}] ✅ Built ${bundles.length} bundles in ${event.buildTime}ms`);
                if (!isOpenBrowser) {
                    isOpenBrowser = true;
                    openBrowser(url);
                }
            }

            if (event.type === 'buildFailure') {
                console.error(`[${name}] ❌ Build failure:`, event.diagnostics);
            }
        });
    } catch (error) {
        console.error(`❌ Failed to start dev server for ${name}: ${error.message}`);
        restore();
    }
}

(async () => {
    try {
        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'Which project do you want to develop?',
            choices: Object.keys(projects).map((name) => ({
                title: name,
                value: name,
            })),
            initial: 0,
        });

        if (response.value) {
            await develop(response.value);
        }
    } catch (error) {
        console.error(`❌ Prompt error: ${error.message}`);
    }
})();
