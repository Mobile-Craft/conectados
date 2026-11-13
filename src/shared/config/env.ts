// Variables públicas del entorno. Expo las incrusta al compilar solo si se leen así, con
// `process.env.EXPO_PUBLIC_…` literal: no se pueden leer con una clave dinámica.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Falta ${name}. Copia .env.example a .env o define la variable en EAS.`);
  }
  return value;
}

export const env = {
  supabaseUrl: required('EXPO_PUBLIC_SUPABASE_URL', supabaseUrl),
  supabasePublishableKey: required('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY', supabasePublishableKey),
} as const;
