import { Stack } from 'expo-router';
import { AppProviders, useTransitions } from '@/app';

// Navegación (HU-1.4): las pestañas son la base; el detalle de un set y los ajustes se apilan
// encima; crear historia es un modal; la partida ocupa la pantalla completa, sin pestañas.
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

function RootStack() {
  const transitions = useTransitions();
  return (
    <Stack screenOptions={transitions.push}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Inicio' }} />
      <Stack.Screen name="pack/[slug]" options={{ title: 'Set' }} />
      <Stack.Screen
        name="game"
        options={{
          ...transitions.game,
          headerShown: false,
          presentation: 'fullScreenModal',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="story/new"
        options={{ ...transitions.modal, presentation: 'modal', title: 'Nueva historia' }}
      />
      <Stack.Screen name="settings" options={{ title: 'Ajustes' }} />
      <Stack.Screen name="about" options={{ title: 'Acerca de' }} />
      <Stack.Screen name="dev/components" options={{ title: 'Componentes' }} />
      <Stack.Screen name="+not-found" options={{ title: 'No encontrada' }} />
    </Stack>
  );
}
