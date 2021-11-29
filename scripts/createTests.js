const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { parse } = require('node-html-parser');
const prettier = require('prettier');

const htmls = glob
    .sync(path.join(process.cwd(), 'docs/document/zh-cn/**/*.html'))
    .filter((item) => !item.includes('libraries'))
    .map((item) => fs.readFileSync(item, 'utf-8'))
    .map((item) =>
        parse(item, {
            lowerCaseTagName: false,
            comment: true,
            blockTextElements: {
                script: false,
                noscript: false,
                style: false,
                pre: true,
            },
        }),
    )
    .map((item) => item.querySelectorAll('pre'))
    .map((item) => item.map((pre) => parse(pre.innerHTML).textContent))
    .flat(Infinity)
    .filter((item) => item.trim().startsWith('var art'))
    .map((item) => item.replace(/\/assets/g, './assets'))
    .map((item) => item.replace(/\s{3}/g, '\n  '));

const tests = `
describe('Document', function() {
    afterEach(function() {
        [...Artplayer.instances].forEach(art => {
            art.destroy(true);
        });
    });

    ${htmls
        .map((item, index) => {
            return `
    it('Test${index}', function(done) {
        ${item}

        setTimeout(() => {
            expect(art.id).to.be.an('number');
            done();
        }, 1000);
    });`;
        })
        .join('\n\n')}
});
`;

const format = prettier.format(tests, { semi: true, parser: 'babel' });
fs.writeFileSync(path.join(process.cwd(), 'test/document.test.js'), format);
