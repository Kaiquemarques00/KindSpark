import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

/** Google sample banner unit IDs (safe defaults for dev). */
const ANDROID_TEST_BANNER_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111';
const IOS_TEST_BANNER_UNIT_ID = 'ca-app-pub-3940256099942544/2934735716';

function parseAdsEnabled(): boolean {
  const raw = process.env.EXPO_PUBLIC_ADS_ENABLED;
  if (raw === undefined || raw === '') return true;
  return raw !== 'false' && raw !== '0';
}

export function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

export type AdsRuntime = {
  enabled: boolean;
  canInitialize: boolean;
  reason?: string;
  bannerUnitId: string;
};

export function getAdsRuntime(): AdsRuntime {
  const enabled = parseAdsEnabled();
  const isWeb = Platform.OS === 'web';
  const expoGo = isExpoGo();
  const isNativeMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  const canInitialize = enabled && isNativeMobile && !expoGo && !isWeb;

  let reason: string | undefined;
  if (!enabled) reason = 'disabled';
  else if (isWeb) reason = 'web';
  else if (expoGo) reason = 'expo-go';
  else if (!isNativeMobile) reason = 'unsupported-platform';

  const bannerUnitId =
    Platform.OS === 'ios'
      ? (process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_IOS ?? IOS_TEST_BANNER_UNIT_ID)
      : Platform.OS === 'android'
        ? (process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_ANDROID ?? ANDROID_TEST_BANNER_UNIT_ID)
        : ANDROID_TEST_BANNER_UNIT_ID;

  return { enabled, canInitialize, reason, bannerUnitId };
}
