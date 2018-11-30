const cpy = require('cpy');

module.exports = (opts = {}) => ({
    name: 'copyAfterBuild',
    generateBundle(outputOptions, bundle, isWrite) {
        if (!isWrite) {
            throw new Error('copyAfterBuild currently only works with bundles that are written to disk');
        }

        if (opts.from && opts.to) {
            cpy(opts.from, opts.to).then(() => {
                console.log('File copy succeeded!');
            }).catch(() => {
                throw new Error('File copy failed!');
            });
        }
    },
});
