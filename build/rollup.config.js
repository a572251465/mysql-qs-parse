const path = require('path')
const resolvePath = (url) => path.resolve(__dirname, url)
const { babel } = require('@rollup/plugin-babel')
const commonJs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const ts = require('@rollup/plugin-typescript')

module.exports = {
  input: [resolvePath('../src/index.ts')],
  output: [
    {
      name: 'mysqlQsParse',
      format: 'umd',
      file: resolvePath('../dist/index.js'),
      inlineDynamicImports: true
    },
    {
      format: 'es',
      file: resolvePath('../dist/index.esm.js'),
      inlineDynamicImports: true
    }
  ],
  plugins: [
    commonJs({
      extensions: ['.js', '.ts'],
      ignoreDynamicRequires: true
    }),
    nodeResolve(),
    babel({
      include: ['src/**/*.ts'],
      exclude: ['node_modules'],
      extensions: ['.js', '.ts'],
      babelHelpers: 'runtime'
    }),
    ts({
      tsconfig: 'tsconfig.json',
      include: ['src/**/*.ts'],
      exclude: ['node_modules'],
      tslib: 'es5'
    })
  ]
}
