import { useRouter } from 'expo-router';
import { useTranslation } from '@/shared/lib';
import { Button, EmptyState, Screen } from '@/shared/ui';

/** Crear historia, como hoja modal. El flujo de escribir o narrar llega con E7. */
export function CreateStoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Screen>
      <EmptyState title={t('createStory.title')} description={t('createStory.description')} />
      <Button label={t('common.close')} variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
