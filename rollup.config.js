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
const { version, homepage } = require('./package.json');
const isProd = process.env.NODE_ENV === 'production';

const banner =
  '/*!\n' +
  ` * ArtPlayer.js v${version}\n` +
  ` * Github: ${homepage}\n` +
  ` * (c) 2017-${new Date().getFullYear()} Harvey Zack\n` +
  ' * Released under the MIT License.\n' +
  ' */\n';

export default {
  input: 'src/index.js',
  output: {
    name: 'artplayer',
    file: isProd ? 'dist/artplayer.js' : 'docs/js/artplayer.js',
    format: 'umd',
    exports: 'named',
    banner: banner
  },
  plugins: [
    eslint({
      exclude: [
        'node_modules/**',
        'docs/**',
        'src/icons/*.svg',
        'src/style/*.scss'
      ]
    }),
    postcss({
      plugins: [autoprefixer, cssnano],
      extract: isProd ? 'dist/artplayer.css' : 'docs/css/artplayer.css'
    }),
    nodeResolve(),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      plugins: ['@babel/external-helpers', '@babel/transform-runtime']
    }),
    svgo({
      raw: true
    }),
    replace({
      exclude: 'node_modules/**',
      __ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
      __VERSION__: version
    }),
    isProd && uglify()
  ]
};
