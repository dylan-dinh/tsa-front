module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      'transform-inline-environment-variables',
      '@babel/plugin-transform-export-namespace-from',
      '@babel/plugin-transform-react-jsx'
    ],
  };
}; 