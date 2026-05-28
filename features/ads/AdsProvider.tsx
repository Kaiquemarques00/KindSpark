import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getAdsRuntime } from '@/features/ads/ads-config';

export type AdsContextValue = {
  enabled: boolean;
  ready: boolean;
  reason?: string;
};

const AdsContext = createContext<AdsContextValue | null>(null);

export function AdsProvider({ children }: { children: ReactNode }) {
  const runtime = useMemo(() => getAdsRuntime(), []);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!runtime.canInitialize) return;

    let cancelled = false;

    void (async () => {
      try {
        const { default: mobileAds } = await import('react-native-google-mobile-ads');
        await mobileAds().initialize();
        if (!cancelled) setReady(true);
      } catch (error) {
        if (__DEV__) {
          console.warn('[ads] SDK initialize failed', error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [runtime.canInitialize]);

  const value = useMemo(
    () => ({
      enabled: runtime.enabled,
      ready: runtime.canInitialize && ready,
      reason: runtime.reason,
    }),
    [runtime.enabled, runtime.canInitialize, runtime.reason, ready],
  );

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export function useAds(): AdsContextValue {
  const ctx = useContext(AdsContext);
  if (!ctx) {
    throw new Error('useAds must be used within AdsProvider');
  }
  return ctx;
}
