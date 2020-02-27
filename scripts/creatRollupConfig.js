const fs = require('fs');
const path = require('path');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const postcss = require('rollup-plugin-postcss');
const { eslint } = require('rollup-plugin-eslint');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('rollup-plugin-replace');
const svgo = require('rollup-plugin-svgo');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const { terser } = require('rollup-plugin-terser');
const copyAfterBuild = require('./copyAfterBuild');
const removeHtmlSpace = require('./removeHtmlSpace');
const json = require('rollup-plugin-json');

module.exports = function creatRollupConfig(projectPath) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8'));
    const { version, homepage, name, expose } = packageJson;
    const isProd = process.env.NODE_ENV === 'production';
    const banner =
        '/*!\n' +
        ` * ${name}.js v${version}\n` +
        ` * Github: ${homepage}\n` +
        ` * (c) 2017-${new Date().getFullYear()} Harvey Zack\n` +
        ' * Released under the MIT License.\n' +
        ' */\n';

    return {
        input: path.join(projectPath, 'src/index.js'),
        output: {
            name: expose,
            file: isProd
                ? path.join(projectPath, `dist/${name}.js`)
                : path.join(process.cwd(), `docs/uncompiled/${name}.js`),
            format: 'umd',
            sourcemap: isProd ? false : true,
        },
        exclude: ['node_modules/**', 'packages/**/node_modules/**'],
        plugins: [
            json({
                exclude: ['node_modules/**', 'packages/**/node_modules/**'],
            }),
            eslint({
                exclude: [
                    'node_modules/**',
                    'packages/*/src/**/*.scss',
                    'packages/*/src/**/*.svg',
                    'packages/*/src/**/*.json',
                ],
            }),
            postcss({
                plugins: [
                    autoprefixer(),
                    cssnano({
                        preset: [
                            'default',
                            {
                                calc: false,
                            },
                        ],
                    }),
                ],
                sourceMap: isProd ? false : true,
                extract: false,
            }),
            nodeResolve(),
            commonjs(),
            babel({
                runtimeHelpers: true,
                exclude: ['node_modules/**', 'packages/**/node_modules/**'],
                presets: [['@babel/env', { modules: false }]],
                plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-runtime'],
            }),
            svgo({
                raw: true,
            }),
            replace({
                exclude: 'node_modules/**',
                __ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
                __VERSION__: version,
            }),
            isProd && sizeSnapshot(),
            isProd && removeHtmlSpace(),
            isProd &&
                terser({
                    output: {
                        preamble: banner,
                        comments: function() {
                            return false;
                        },
                    },
                }),
            isProd &&
                copyAfterBuild({
                    from: path.join(projectPath, 'dist/*'),
                    to: path.join(process.cwd(), 'dist'),
                }),
        ],
    };
};
