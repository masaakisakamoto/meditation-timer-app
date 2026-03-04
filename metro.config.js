/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * SVG ファイルをコンポーネントとして扱うための設定
 */
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // 拡張子 .svg を JS モジュールとして扱う
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };

  // svg を assetExts から外し、sourceExts に追加
  config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...config.resolver.sourceExts, 'svg'],
  };

  return config;
})();
