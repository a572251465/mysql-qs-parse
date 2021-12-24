const path = require('path')
const resolvePath = (url) => path.resolve(__dirname, url)
const { terser } = require('rollup-plugin-terser')
const ts = require('@rollup/plugin-typescript')

module.exports = {
  input: [resolvePath('../src/index.ts')],
  output: {
    format: 'cjs',
    file: resolvePath('../dist/index.js'),
    exports: 'default'
  },
  plugins: [
    ts({
      tsconfig: resolvePath('../tsconfig.json'),
      include: ['src/**/*.ts'],
      exclude: ['node_modules'],
      tslib: 'es5'
    }),
    terser()
  ]
}
