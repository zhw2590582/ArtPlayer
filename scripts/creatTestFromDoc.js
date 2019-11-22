const fs = require('fs');
const path = require('path');
const logger = require('./logger');

try {
    const documentText = fs.readFileSync(path.resolve(__dirname, '../docs/document/README.md'), 'utf-8');
    const jsTests = documentText.match(/\[Run Code\]\(\/([\s\S]*?)\)\n\n\`{3}js([\s\S]*?)\`{3}/g);
    const jsBlocks = jsTests.map(item => {
        const result = item.match(/\[Run Code\]\(\/([\s\S]*)\)\n\n\`{3}js([\s\S]*?)\`{3}/);
        return {
            name: result[1],
            code: result[2],
        };
    });

    fs.writeFileSync(
        path.resolve(__dirname, '../test/document.test.js'),
        `
describe('Document', function() {
    afterEach(function() {
        [...Artplayer.instances].forEach(art => {
            art.destroy(true);
        });
    });

    ${jsBlocks
        .map(item => {
            return `
    it(\`${item.name}\`, function() {
            ${item.code}
    });
        `;
        })
        .join('\n')};
});    
    `,
    );

    logger.success('Create a test case from the document successfully');
} catch (error) {
    logger.fatal(error);
}
