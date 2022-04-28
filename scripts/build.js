import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import projects from './projects.js';
import { Parcel } from '@parcel/core';

async function develop(name) {
    const { version } = JSON.parse(fs.readFileSync(`${projects[name]}/package.json`, 'utf-8'));
    process.chdir(projects[name]);

    const bundler = new Parcel({
        entries: `${projects[name]}/src/index.js`,
        defaultConfig: '@parcel/config-default',
        mode: 'production',
        targets: ['main'],
        defaultTargetOptions: {
            sourceMaps: false,
            outputFormat: 'global',
            engines: {
                browsers: ['last 1 Chrome version'],
            },
        },
        env: {
            NODE_ENV: 'production',
            APP_VER: version,
            BUILD_DATE: Date.now(),
        },
    });

    try {
        const { bundleGraph, buildTime } = await bundler.run();
        const bundles = bundleGraph.getBundles();
        console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
    } catch (err) {
        console.log(err.diagnostics);
    }
}

inquirer
    .prompt([
        {
            type: 'list',
            message: 'Which project do you want to build?',
            name: 'project',
            choices: Object.keys(projects),
        },
    ])
    .then((answers) => {
        develop(answers.project);
    });
