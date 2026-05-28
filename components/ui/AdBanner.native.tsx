import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { BannerAd as BannerAdType, BannerAdSize } from 'react-native-google-mobile-ads';

import { AdBannerShell } from '@/components/ui/AdBannerShell';
import { getAdsRuntime, useAds } from '@/features/ads';

export type AdBannerProps = {
  /** Placement key for future analytics (e.g. `today_bottom`). */
  placement?: string;
};

type AdsLib = {
  BannerAd: typeof BannerAdType;
  bannerSize: (typeof BannerAdSize)['BANNER'];
};

export function AdBanner({ placement: _placement }: AdBannerProps) {
  const { enabled, ready } = useAds();
  const [failed, setFailed] = useState(false);
  const [adsLib, setAdsLib] = useState<AdsLib | null>(null);
  const { bannerUnitId, canInitialize } = getAdsRuntime();

  useEffect(() => {
    if (!enabled || !ready || !canInitialize || failed) {
      setAdsLib(null);
      return;
    }

    let cancelled = false;

    void import('react-native-google-mobile-ads')
      .then((mod) => {
        if (cancelled) return;
        setAdsLib({ BannerAd: mod.BannerAd, bannerSize: mod.BannerAdSize.BANNER });
      })
      .catch(() => {
        setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, ready, canInitialize, failed, _placement]);

  if (!enabled || !ready || !canInitialize || failed || !adsLib) {
    return <AdBannerShell />;
  }

  const { BannerAd, bannerSize } = adsLib;

  return (
    <View style={styles.wrap} accessibilityLabel="Advertisement">
      <BannerAd
        unitId={bannerUnitId}
        size={bannerSize}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
});
