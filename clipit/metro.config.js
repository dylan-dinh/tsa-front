const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable experimentalImportSupport to prefer CommonJS builds over ESM where possible.
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
  },
});

// Prefer CJS over ESM so packages resolve to their pre-compiled CommonJS builds.
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

// Metro skips Babel for node_modules by default.
// This pattern un-skips packages that ship untranspiled code (ESM or private
// class fields) so they get compiled by the hermes-v0 Babel profile above.
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!(react-native|@react-native|@react-native-community|expo|@expo|@unimodules|unimodules|sentry-expo|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@react-navigation|react-native-get-random-values|react-native-web|@gorhom|@shopify)/)',
];

// Node.js polyfills
config.resolver.alias = {
  ...config.resolver.alias,
  buffer: 'buffer',
  crypto: 'react-native-get-random-values',
  stream: 'readable-stream',
  util: 'util',
  process: 'process',
};

config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  require.resolve('buffer'),
];

config.resolver.fallback = {
  ...config.resolver.fallback,
  process: require.resolve('process'),
  buffer: require.resolve('buffer'),
  util: require.resolve('util'),
  stream: require.resolve('readable-stream'),
};

config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
