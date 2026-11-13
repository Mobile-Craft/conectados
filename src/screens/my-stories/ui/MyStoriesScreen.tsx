import { useRouter } from 'expo-router';
import { EmptyState, Screen } from '@/shared/ui';

/** Pestaña Mis historias. La lista llega con E7; de momento, el estado vacío y crear. */
export function MyStoriesScreen() {
  const router = useRouter();
  return (
    <Screen>
      <EmptyState
        title="Aún no tienes historias"
        description="Escribe o narra una historia y la convertimos en un set para jugar."
        actionLabel="Crear historia"
        onAction={() => router.push('/story/new')}
      />
    </Screen>
  );
}
