export default {
  expo: {
    name: "mittertimer",
    slug: "mittertimer",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "jp.theravada.meditation",
      buildNumber: "1",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "jp.theravada.meditation",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    extra: {
      eas: {
        projectId: "20b85940-c010-4d09-aede-a29ecf259642",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};