import fs from 'fs';
import path from 'path';
import servor from 'servor';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import projects from './projects.js';
import { Parcel } from '@parcel/core';
import openBrowser from 'servor/utils/openBrowser.js';

async function develop(name) {
    const uncompiledPath = path.resolve(`docs/uncompiled/${name}`);
    const { version } = JSON.parse(fs.readFileSync(`${projects[name]}/package.json`, 'utf-8'));

    const { url } = await servor({
        root: 'docs',
        fallback: 'index.html',
        reload: true,
        port: 8081,
    });

    openBrowser(url);
    process.chdir(projects[name]);

    const bundler = new Parcel({
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
            BUILD_DATE: Date.now(),
        },
        additionalReporters: [
            {
                packageName: '@parcel/reporter-cli',
                resolveFrom: fileURLToPath(import.meta.url),
            },
        ],
    });

    bundler.watch(async (error, event) => {
        if (error) throw error;
        if (event.type === 'buildSuccess') {
            const bundles = event.bundleGraph.getBundles();
            console.log(`[${name}]`, `✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`);
        } else if (event.type === 'buildFailure') {
            console.log(`[${name}]`, event.diagnostics);
        }
    });
}

inquirer
    .prompt([
        {
            type: 'list',
            message: 'Which project do you want to develop?',
            name: 'project',
            choices: Object.keys(projects),
        },
    ])
    .then((answers) => {
        develop(answers.project);
    });
