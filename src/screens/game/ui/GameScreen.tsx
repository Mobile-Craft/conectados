import { useNavigation, usePreventRemove, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { QuestionCard } from '@/entities/question';
import { useTranslation } from '@/shared/lib';
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
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [finishing, setFinishing] = useState(false);
  // La salida confirmada se ejecuta en el render siguiente, cuando ya no hay bloqueo.
  const [exit, setExit] = useState<NavigationAction | null>(null);

  usePreventRemove(!finishing && !exit, ({ data }) => {
    Alert.alert(t('game.leaveTitle'), t('game.leaveMessage'), [
      { text: t('game.keepPlaying'), style: 'cancel' },
      { text: t('game.leave'), style: 'destructive', onPress: () => setExit(data.action) },
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
        category={t('sample.question.category')}
        text={t('sample.question.text')}
        intensity={{ level: 4, label: t('sample.intensity.intense') }}
      />
      <Stack direction="row" gap={3}>
        <Button label={t('game.skip')} variant="secondary" onPress={() => {}} />
        <Button label={t('game.finish')} onPress={() => setFinishing(true)} />
      </Stack>
    </Screen>
  );
}
