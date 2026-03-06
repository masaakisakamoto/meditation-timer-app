const isDevClient = process.env.APP_VARIANT === 'development';

const appName = isDevClient ? 'mittertimer Dev' : 'mittertimer';
const iosBundleId = isDevClient
  ? 'jp.theravada.meditation.dev'
  : 'jp.theravada.meditation';
const androidPackage = isDevClient
  ? 'jp.theravada.meditation.dev'
  : 'jp.theravada.meditation';

export default {
  expo: {
    name: appName,
    slug: 'mittertimer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: iosBundleId,
      buildNumber: '1',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        UIBackgroundModes: ['audio'],
      },
    },
    android: {
      package: androidPackage,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    extra: {
      eas: {
        projectId: '20b85940-c010-4d09-aede-a29ecf259642',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
  },
};
