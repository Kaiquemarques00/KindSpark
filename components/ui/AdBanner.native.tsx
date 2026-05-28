import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { AdBannerShell } from '@/components/ui/AdBannerShell';
import { getAdsRuntime, useAds } from '@/features/ads';

export type AdBannerProps = {
  /** Placement key for future analytics (e.g. `today_bottom`). */
  placement?: string;
};

export function AdBanner({ placement: _placement }: AdBannerProps) {
  const { enabled, ready } = useAds();
  const [failed, setFailed] = useState(false);
  const { bannerUnitId } = getAdsRuntime();

  if (!enabled || !ready || failed) {
    return <AdBannerShell />;
  }

  return (
    <View style={styles.wrap} accessibilityLabel="Advertisement">
      <BannerAd
        unitId={bannerUnitId}
        size={BannerAdSize.BANNER}
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
