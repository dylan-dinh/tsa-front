const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add Node.js polyfills
config.resolver.alias = {
  ...config.resolver.alias,
  buffer: 'buffer',
  crypto: 'react-native-get-random-values',
  stream: 'readable-stream',
  util: 'util',
  process: 'process',
};

// Add buffer to the list of node modules
config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  require.resolve('buffer'),
];

// Add process polyfill
config.resolver.fallback = {
  ...config.resolver.fallback,
  process: require.resolve('process'),
};

module.exports = config; 