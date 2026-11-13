import { Stack } from 'expo-router';
import { AppProviders } from '@/app';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Conectados' }} />
        <Stack.Screen name="about" options={{ title: 'Acerca de' }} />
        <Stack.Screen name="settings" options={{ title: 'Ajustes' }} />
      </Stack>
    </AppProviders>
  );
}
