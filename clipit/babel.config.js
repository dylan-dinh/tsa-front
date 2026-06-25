module.exports = function(api) {
  api.cache(true);
  return {
    // hermes-v0 forces transpilation of private class fields (#field syntax).
    // hermes-v1 ("hermes-stable") skips this assuming native Hermes support,
    // but Expo Go 54 ships an older Hermes that can't parse #field → crash.
    presets: [['babel-preset-expo', { unstable_transformProfile: 'hermes-v0' }]],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};