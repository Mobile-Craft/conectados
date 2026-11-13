import { Stack } from 'expo-router';
import { useTranslation } from '@/shared/lib';
import { useTransitions } from './transitions';

/**
 * El stack raíz (HU-1.4): las pestañas son la base; el detalle de un set y los ajustes se apilan
 * encima; crear historia es un modal; la partida ocupa la pantalla completa, sin pestañas.
 */
export function RootStack() {
  const transitions = useTransitions();
  const { t } = useTranslation();
  return (
    <Stack screenOptions={transitions.push}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: t('nav.home') }} />
      <Stack.Screen name="pack/[slug]" options={{ title: t('nav.pack') }} />
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
        options={{ ...transitions.modal, presentation: 'modal', title: t('nav.newStory') }}
      />
      <Stack.Screen name="settings" options={{ title: t('nav.settings') }} />
      <Stack.Screen name="about" options={{ title: t('nav.about') }} />
      <Stack.Screen name="dev/components" options={{ title: t('nav.components') }} />
      <Stack.Screen name="+not-found" options={{ title: t('nav.notFound') }} />
    </Stack>
  );
}
