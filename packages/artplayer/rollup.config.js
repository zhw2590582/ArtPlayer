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
const { uglify } = require('rollup-plugin-uglify');
const { version, homepage, name } = require('./package.json');
const isProd = process.env.NODE_ENV === 'production';

const banner =
  '/*!\n' +
  ` * ${name}.js v${version}\n` +
  ` * Github: ${homepage}\n` +
  ` * (c) 2017-${new Date().getFullYear()} Harvey Zack\n` +
  ' * Released under the MIT License.\n' +
  ' */\n';

export default {
  input: 'src/index.js',
  output: {
    name: name,
    file: isProd ? `dist/${name}.js` : path.join(process.cwd(), '../../', `docs/js/${name}.js`),
    format: 'umd',
    exports: 'named'
  },
  plugins: [
    eslint({
      exclude: [
        'node_modules/**',
        'src/**/*.scss',
        'src/**/*.svg'
      ]
    }),
    postcss({
      plugins: [autoprefixer, cssnano],
      extract: isProd ? `dist/${name}.css` : path.join(process.cwd(), '../../', `docs/css/${name}.css`)
    }),
    nodeResolve(),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      presets: [['@babel/env', { modules: false }]],
      plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-runtime']
    }),
    svgo({
      raw: true
    }),
    replace({
      exclude: 'node_modules/**',
      __ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
      __VERSION__: version
    }),
    isProd && uglify({
      output: {
        preamble: banner
      }
    })
  ]
};
