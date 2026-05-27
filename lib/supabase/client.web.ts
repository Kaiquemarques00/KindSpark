import 'react-native-url-polyfill/auto';

import type { RealtimeClientOptions } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { createSupabaseClient } from './create-client';

function getNodeRealtimeOptions(): RealtimeClientOptions | undefined {
  const isNodeSsr =
    Platform.OS === 'web' &&
    typeof window === 'undefined' &&
    typeof process !== 'undefined' &&
    Boolean(process.versions?.node);

  if (!isNodeSsr) {
    return undefined;
  }

  // Node.js < 22 (Expo web SSR): Supabase Realtime needs the `ws` transport.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ws = require('ws') as typeof import('ws');
  return { transport: (ws.WebSocket ?? ws) as NonNullable<RealtimeClientOptions['transport']> };
}

export const supabase = createSupabaseClient(getNodeRealtimeOptions());
