import { useRouter } from 'expo-router';
import { Button, Screen, Text } from '@/shared/ui';

/**
 * Configurar la partida (jugadores y ajustes llegan con E4). Abre el flujo a pantalla completa.
 * Empezar reemplaza esta pantalla: una vez en juego, atrás sale del flujo, no vuelve aquí.
 */
export function GameSetupScreen({ pack }: { pack?: string }) {
  const router = useRouter();
  return (
    <Screen>
      <Text variant="title2" align="center" accessibilityRole="header">
        Configurar partida
      </Text>
      {pack ? <Text tone="secondary">{pack}</Text> : null}
      <Button label="Empezar" size="lg" onPress={() => router.replace('/game/play')} />
      <Button label="Cancelar" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
