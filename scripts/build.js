const inquirer = require('inquirer');
const rollup = require('rollup');
const logger = require('./logger');
const projects = require('./getProjects')();
const creatRollupConfig = require('./creatRollupConfig');

const isBuildAll = process.argv.pop() === 'all';

function build(projectPath) {
    const { input, output, plugins } = creatRollupConfig(projectPath);
    logger.log(`bundling ${output.file}...`);
    return rollup
        .rollup({
            input,
            plugins,
        })
        .then(bundle => {
            bundle.write(output);
            logger.success('finished building all bundles');
        });
}

if (isBuildAll) {
    const bundles = [];
    Object.keys(projects).forEach(item => {
        const projectPath = projects[item];
        bundles.push(build(projectPath));
    });

    Promise.all(bundles)
        .then(() => {
            logger.success('----finished building all packages----');
        })
        .catch(err => {
            logger.fatal(err);
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
        .then(answers => {
            build(projects[answers.project]);
        })
        .catch(err => {
            logger.fatal(err);
        });
}
