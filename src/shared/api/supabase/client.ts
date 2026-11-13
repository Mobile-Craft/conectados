import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { env } from '@/shared/config';
import { createChunkedStorage } from './chunked-storage';
import type { Database } from './database.types';

// La sesión vive en el llavero (iOS) o en el Keystore (Android). Accesible tras el primer
// desbloqueo para que el refresco funcione aunque la app despierte con la pantalla bloqueada.
const secureStore = createChunkedStorage({
  getItemAsync: (key) =>
    SecureStore.getItemAsync(key, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK }),
  setItemAsync: (key, value) =>
    SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK }),
  deleteItemAsync: (key) =>
    SecureStore.deleteItemAsync(key, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK }),
});

/** Cliente único de Supabase, tipado con el esquema. En web, Supabase usa su almacén propio. */
export const supabase = createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : secureStore,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
