import { useRouter } from 'expo-router';
import { Button, EmptyState, Screen } from '@/shared/ui';

/**
 * Resumen al terminar. Volver al inicio cierra todo el flujo de partida y deja Descubrir; atrás
 * cierra el flujo y vuelve a donde se empezó (no a la partida, que ya terminó).
 */
export function GameSummaryScreen() {
  const router = useRouter();
  return (
    <Screen>
      <EmptyState title="Partida terminada" description="Aquí verás las preguntas jugadas." />
      <Button label="Volver al inicio" size="lg" onPress={() => router.dismissTo('/')} />
    </Screen>
  );
}
