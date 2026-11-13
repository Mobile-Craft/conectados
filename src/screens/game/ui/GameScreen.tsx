import { useNavigation, usePreventRemove, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { QuestionCard } from '@/entities/question';
import { Button, Screen, Stack } from '@/shared/ui';

type NavigationAction = Parameters<
  NonNullable<Parameters<typeof usePreventRemove>[1]>
>[0]['data']['action'];

/**
 * La partida, a pantalla completa y sin pestañas. Las preguntas reales llegan con E4.
 * Salir a medias (atrás de Android, o cualquier otra vía) pide confirmación: un toque sin querer
 * no debe tirar una partida. Terminar no pregunta.
 */
export function GameScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [finishing, setFinishing] = useState(false);
  // La salida confirmada se ejecuta en el render siguiente, cuando ya no hay bloqueo.
  const [exit, setExit] = useState<NavigationAction | null>(null);

  usePreventRemove(!finishing && !exit, ({ data }) => {
    Alert.alert('¿Salir de la partida?', 'Se perderá lo que llevan jugado.', [
      { text: 'Seguir jugando', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => setExit(data.action) },
    ]);
  });

  useEffect(() => {
    if (exit) navigation.dispatch(exit);
  }, [exit, navigation]);

  useEffect(() => {
    if (finishing) router.replace('/game/summary');
  }, [finishing, router]);

  return (
    <Screen>
      <QuestionCard
        category="Confesión"
        text="¿Qué secreto nunca le contaste a nadie de esta mesa?"
        intensity={{ level: 4, label: 'Intensa' }}
      />
      <Stack direction="row" gap={3}>
        <Button label="Saltar" variant="secondary" onPress={() => {}} />
        <Button label="Terminar" onPress={() => setFinishing(true)} />
      </Stack>
    </Screen>
  );
}
