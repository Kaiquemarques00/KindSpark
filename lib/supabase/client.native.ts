import 'react-native-url-polyfill/auto';

import { createSupabaseClient } from './create-client';

export const supabase = createSupabaseClient();
