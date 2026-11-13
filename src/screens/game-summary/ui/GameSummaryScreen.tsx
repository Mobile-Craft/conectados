import { useRouter } from 'expo-router';
import { useTranslation } from '@/shared/lib';
import { Button, EmptyState, Screen } from '@/shared/ui';

/**
 * Resumen al terminar. Volver al inicio cierra todo el flujo de partida y deja Descubrir; atrás
 * cierra el flujo y vuelve a donde se empezó (no a la partida, que ya terminó).
 */
export function GameSummaryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Screen>
      <EmptyState title={t('game.summaryTitle')} description={t('game.summaryDescription')} />
      <Button label={t('game.backHome')} size="lg" onPress={() => router.dismissTo('/')} />
    </Screen>
  );
}
