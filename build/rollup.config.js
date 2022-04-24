const path = require('path')
const resolvePath = (url) => path.resolve(__dirname, url)
const { terser } = require('rollup-plugin-terser')
const ts = require('@rollup/plugin-typescript')
const del = require('rollup-plugin-del')

module.exports = {
  input: [resolvePath('../src/index.ts')],
  output: [
    {
      format: 'cjs',
      file: resolvePath('../dist/index.cjs.js'),
      exports: 'default'
    },
    {
      format: 'es',
      file: resolvePath('../dist/index.es.js'),
      exports: 'default'
    }
  ],
  plugins: [
    del(),
    ts({
      tsconfig: resolvePath('../tsconfig.json'),
      include: ['src/**/*.ts'],
      exclude: ['node_modules'],
      tslib: 'es5'
    }),
    terser()
  ]
}
