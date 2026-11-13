import { useRouter } from 'expo-router';
import { useTranslation } from '@/shared/lib';
import { Button, Screen, Text } from '@/shared/ui';

/**
 * Configurar la partida (jugadores y ajustes llegan con E4). Abre el flujo a pantalla completa.
 * Empezar reemplaza esta pantalla: una vez en juego, atrás sale del flujo, no vuelve aquí.
 */
export function GameSetupScreen({ pack }: { pack?: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Screen>
      <Text variant="title2" align="center" accessibilityRole="header">
        {t('game.setupTitle')}
      </Text>
      {pack ? <Text tone="secondary">{pack}</Text> : null}
      <Button label={t('game.start')} size="lg" onPress={() => router.replace('/game/play')} />
      <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
