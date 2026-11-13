import { useRouter } from 'expo-router';
import { useTranslation } from '@/shared/lib';
import { EmptyState, Screen } from '@/shared/ui';

/** Un enlace que no lleva a ninguna pantalla (deep link roto o viejo): se explica y se vuelve. */
export function NotFoundScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Screen>
      <EmptyState
        title={t('notFound.title')}
        description={t('notFound.description')}
        actionLabel={t('common.goHome')}
        onAction={() => router.replace('/')}
      />
    </Screen>
  );
}
