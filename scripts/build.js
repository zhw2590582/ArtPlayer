const path = require('path');
const inquirer = require('inquirer');
const rollup = require('rollup');
const del = require('del');
const logger = require('./logger');
const projects = require('./getProjects')();
const creatRollupConfig = require('./creatRollupConfig');

const isBuildAll = process.argv.pop() === 'all';

function runPromisesInSeries(ps) {
    return ps.reduce((p, next) => p.then(next), Promise.resolve());
}

function build(projectPath) {
    const { input, output, plugins } = creatRollupConfig(projectPath);
    const dist = path.join(projectPath, 'dist');
    return del(dist).then(() => {
        logger.success(`----Delete directory successfully: ${dist}----`);
        logger.log(`bundling ${output.file}...`);
        return rollup
            .rollup({
                input,
                plugins,
            })
            .then((bundle) => {
                bundle.write(output);
                logger.success(`finished building all bundles from ${projectPath}`);
            });
    });
}

if (isBuildAll) {
    const bundles = [];
    Object.keys(projects).forEach((item) => {
        const projectPath = projects[item];
        bundles.push(() => build(projectPath));
    });

    const dist = path.join(process.cwd(), 'dist');
    del(dist).then(() => {
        logger.success(`----Delete directory successfully: ${dist}----`);
        runPromisesInSeries(bundles)
            .then(() => {
                logger.success('----finished building all packages----');
            })
            .catch((err) => {
                logger.fatal(err);
            });
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
            build(projects[answers.project]);
        })
        .catch((err) => {
            logger.fatal(err);
        });
}
