import fs from 'fs';
import path from 'path';
import servor from 'servor';
import prompts from 'prompts';
import { fileURLToPath } from 'url';
import { Parcel } from '@parcel/core';
import { formatDate, getProjects } from './utils.js';
import openBrowser from 'servor/utils/openBrowser.js';

const projects = getProjects();

async function develop(name) {
    let isOpenBrowser = false;
    const uncompiledPath = path.resolve(`docs/uncompiled/${name}`);

    const projectPackageJson = path.join(projects[name], 'package.json');
    const { version } = JSON.parse(fs.readFileSync(projectPackageJson, 'utf-8'));

    const serverConfig = {
        root: 'docs',
        fallback: 'index.html',
        reload: true,
        port: 8082,
    };

    try {
        const { url } = await servor(serverConfig);
        process.chdir(projects[name]);

        const bundlerConfig = {
            entries: `${projects[name]}/src/index.js`,
            defaultConfig: '@parcel/config-default',
            mode: 'development',
            targets: {
                main: {
                    distDir: uncompiledPath,
                    outputFormat: 'global',
                    engines: {
                        browsers: ['last 1 Chrome version'],
                    },
                },
            },
            env: {
                NODE_ENV: 'development',
                APP_VER: version,
                BUILD_DATE: formatDate(Date.now()),
            },
            additionalReporters: [
                {
                    packageName: '@parcel/reporter-cli',
                    resolveFrom: fileURLToPath(import.meta.url),
                },
            ],
        };

        const bundler = new Parcel(bundlerConfig);

        bundler.watch((error, event) => {
            if (error) {
                console.error(`Build error: ${error}`);
                return;
            }
            if (event.type === 'buildSuccess') {
                const bundles = event.bundleGraph.getBundles();
                console.log(`[${name}] ✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`);
                if (!isOpenBrowser) {
                    isOpenBrowser = true;
                    openBrowser(url);
                }
            } else if (event.type === 'buildFailure') {
                console.error(`[${name}] Build failure:`, event.diagnostics);
            }
        });
    } catch (error) {
        console.error(`Failed to start development server for ${name}: ${error.message}`);
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
            develop(response.value);
        }
    } catch (error) {
        console.error(`Prompt error: ${error.message}`);
    }
})();
