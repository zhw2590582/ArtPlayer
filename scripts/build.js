import fs from 'fs';
import inquirer from 'inquirer';
import projects from './projects.js';
import { Parcel } from '@parcel/core';

async function build(name) {
    const { version } = JSON.parse(fs.readFileSync(`${projects[name]}/package.json`, 'utf-8'));
    process.chdir(projects[name]);

    const bundler = new Parcel({
        entries: `${projects[name]}/src/index.js`,
        defaultConfig: '@parcel/config-default',
        mode: 'production',
        targets: {
            main: {
                distDir: `${projects[name]}/dist`,
                sourceMap: false,
                outputFormat: 'global',
                engines: {
                    browsers: ['last 1 Chrome version'],
                },
            },
        },
        env: {
            NODE_ENV: 'production',
            APP_VER: version,
            BUILD_DATE: Date.now(),
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
    const newFilePath = `${projects[name]}/dist/${name}.js`;
    const code = banner + fs.readFileSync(filePath);
    fs.writeFileSync(filePath, code);
    fs.renameSync(filePath, newFilePath);
    console.log(`✨ Built ${name} ${bundles.length} bundles in ${buildTime}ms!`);
}

function runPromisesInSeries(ps) {
    return ps.reduce((p, next) => p.then(next), Promise.resolve());
}

if (process.argv.pop() === 'all') {
    const bundles = Object.keys(projects).map((name) => () => build(name));
    runPromisesInSeries(bundles).then(() => {
        console.log(`✨ Finished building all packages!`);
    });
} else {
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
            build(answers.project);
        });
}
