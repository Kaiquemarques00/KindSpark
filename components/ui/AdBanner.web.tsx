import { AdBannerShell } from '@/components/ui/AdBannerShell';
import { useAds } from '@/features/ads';

export type AdBannerProps = {
  placement?: string;
};

export function AdBanner({ placement: _placement }: AdBannerProps) {
  const { enabled } = useAds();

  if (!enabled) {
    return <AdBannerShell />;
  }

  return <AdBannerShell />;
}
