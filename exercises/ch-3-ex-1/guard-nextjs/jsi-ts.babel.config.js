module.exports = {
  // sourceType: 'script',
  // sourceType: 'module',
  sourceType: 'unambiguous',
  presets: [
    '@babel/preset-typescript',
    // '@babel/preset-env',
    // ['@babel/preset-env', {
    //   modules: 'commonjs',
    //   useBuiltIns: false,
    // }],
  ],
  plugins: [
    '@babel/plugin-transform-typescript',
  ],
};
