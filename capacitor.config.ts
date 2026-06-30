import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mindease.app",
  appName: "MindEase",
  webDir: "out",
  server: {
    // For development, you can use your local server
    // url: "http://localhost:3000",
    // cleartext: true,
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "MindEase",
    backgroundColor: "#FAF8F5",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#FAF8F5",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#FAF8F5",
    },
  },
};

export default config;
