const inquirer = require('inquirer');
const rollup = require('rollup');
const servor = require('servor');
const logger = require('./logger');
const projects = require('./getProjects')();
const creatRollupConfig = require('./creatRollupConfig');
const openBrowser = require('servor/utils/openBrowser');

async function develop(projectPath) {
    const config = creatRollupConfig(projectPath);
    const { url } = await servor({
        root: 'docs',
        fallback: 'index.html',
        reload: true,
        port: 8081,
    });
    openBrowser(url);
    const watcher = rollup.watch(config);
    watcher.on('event', (event) => {
        switch (event.code) {
            case 'START':
                logger.log('checking rollup version...');
                break;
            case 'BUNDLE_START':
                logger.log(`bundling ${config.output.file}...`);
                break;
            case 'BUNDLE_END':
                logger.success(`${config.output.file} bundled in ${event.duration}ms.`);
                logger.success('Watching for changes...');
                break;
            case 'END':
                logger.success('finished building all bundles');
                break;
            case 'ERROR':
                logger.warn(`error: ${event.error}`);
                break;
            case 'FATAL':
                logger.warn(`fatal: ${event.error}`);
                break;
            default:
                logger.warn(`unknown event: ${event.code}`);
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
        develop(projects[answers.project]);
    })
    .catch((err) => {
        logger.fatal(err);
    });

module.exports = develop;
