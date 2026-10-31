export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  server?: {
    androidScheme?: string;
    cleartext?: boolean;
    url?: string;
  };
  plugins?: Record<string, any>;
}

const config: CapacitorConfig = {
  appId: 'com.mhbdmart.app',
  appName: 'MHBDMART',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#090D16',
      showSpinner: true,
      spinnerColor: '#10B981',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      backgroundColor: '#090D16',
      style: 'DARK',
    },
  },
};

export default config;
