import resolve from 'rollup-plugin-node-resolve';

module.exports = {
  input: 'src/app.js',
  output: {
    file: 'dist/app.js',
    format: 'esm'
  },
  plugins: [
    resolve()
  ] 
};
