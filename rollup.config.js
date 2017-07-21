// rollup.config.js
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

module.exports = {
  entry: 'index.js',
  dest: 'build/data-set.js',
  moduleName: 'DataSet',
  format: 'umd',
  plugins: [
    resolve(),
    commonjs(),
    babel({
      // exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
