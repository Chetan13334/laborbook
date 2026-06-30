import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

function isValidUrl(value?: string) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function createDisabledClient() {
  const disabledError = new Error('Supabase environment variables are missing.');

  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: disabledError };
      },
      async getUser() {
        return { data: { user: null }, error: disabledError };
      },
      async signUp() {
        return { data: { user: null, session: null }, error: disabledError };
      },
      async signInWithPassword() {
        return { data: { user: null, session: null }, error: disabledError };
      },
      async signOut() {
        return { error: disabledError };
      },
    },
    from() {
      return {
        select() {
          return this;
        },
        order() {
          return this;
        },
        eq() {
          return this;
        },
        maybeSingle() {
          return Promise.resolve({ data: null, error: disabledError });
        },
        single() {
          return Promise.resolve({ data: null, error: disabledError });
        },
        insert() {
          return {
            select() {
              return this;
            },
            single() {
              return Promise.resolve({ data: null, error: disabledError });
            },
          };
        },
        update() {
          return {
            eq() {
              return this;
            },
            select() {
              return this;
            },
            single() {
              return Promise.resolve({ data: null, error: disabledError });
            },
          };
        },
      };
    },
  } as unknown as SupabaseClient;
}

export const supabase =
  isValidUrl(supabaseUrl) && supabaseAnonKey
    ? createClient(supabaseUrl!, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : createDisabledClient();
