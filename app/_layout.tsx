import { AppProviders, RootStack } from '@/app';

// Debajo de todo van las pestañas, también al entrar por un deep link: atrás vuelve a Descubrir
// en vez de cerrar la app.
export const unstable_settings = { initialRouteName: '(tabs)' };

export default function RootLayout() {
  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  );
}
