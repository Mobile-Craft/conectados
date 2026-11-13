import { useRouter } from 'expo-router';
import { useTranslation } from '@/shared/lib';
import { EmptyState, Screen } from '@/shared/ui';

/** Pestaña Mis historias. La lista llega con E7; de momento, el estado vacío y crear. */
export function MyStoriesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Screen>
      <EmptyState
        title={t('myStories.emptyTitle')}
        description={t('myStories.emptyDescription')}
        actionLabel={t('myStories.create')}
        onAction={() => router.push('/story/new')}
      />
    </Screen>
  );
}
