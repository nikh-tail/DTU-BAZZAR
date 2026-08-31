import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dtubazaar.app',
  appName: 'DTU Bazaar',
  webDir: 'dist',
  bundledWebRuntime: false,
  backgroundColor: '#070B14',
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#070B14',
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#070B14',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#070B14',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  ios: {
    backgroundColor: '#070B14',
    contentInset: 'always',
    preferredContentMode: 'mobile',
  },
};

export default config;
