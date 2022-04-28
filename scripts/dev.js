import inquirer from 'inquirer';
import servor from 'servor';
import projects from './projects.js';
import openBrowser from 'servor/utils/openBrowser.js';
import { Parcel } from '@parcel/core';
import { fileURLToPath } from 'url';

async function develop(name) {
    const { url } = await servor({
        root: 'docs',
        fallback: 'index.html',
        reload: true,
        port: 8081,
    });

    openBrowser(url);

    const bundler = new Parcel({
        entries: `${projects[name]}/src/index.js`,
        defaultConfig: '@parcel/config-default',
        mode: 'development',
        targets: ['modern'],
        defaultTargetOptions: {
            distDir: `docs/uncompiled`,
            engines: {
                browsers: ['last 1 Chrome version'],
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
