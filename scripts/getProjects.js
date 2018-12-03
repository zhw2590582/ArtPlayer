const path = require('path');
const glob = require('glob');

module.exports = function getProjects() {
    const projects = {};
    glob.sync(path.join(process.cwd(), 'packages/*')).forEach(item => {
        const name = item.split(path.sep).pop();
        projects[name] = item;
    });
    return projects;
};
