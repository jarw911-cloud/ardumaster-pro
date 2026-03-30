import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kangmas.ardumaster',
  appName: 'ArduMaster PRO',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;