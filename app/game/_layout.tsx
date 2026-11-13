import { Stack } from 'expo-router';
import { useTransitions } from '@/app';

/** El flujo de partida: su propio stack, sin cabecera ni pestañas. */
export default function GameLayout() {
  const transitions = useTransitions();
  return <Stack screenOptions={{ ...transitions.gameStep, headerShown: false }} />;
}
