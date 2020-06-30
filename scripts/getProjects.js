const path = require('path');
const glob = require('glob');

module.exports = function getProjects() {
    return glob.sync(path.join(process.cwd(), 'packages/*')).reduce((result, item) => {
        const name = item.split(path.sep).pop();
        result[name] = item;
        return result;
    }, {});
};
