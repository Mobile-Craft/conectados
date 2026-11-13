import { useRouter } from 'expo-router';
import { EmptyState, Screen } from '@/shared/ui';

/** Un enlace que no lleva a ninguna pantalla (deep link roto o viejo): se explica y se vuelve. */
export function NotFoundScreen() {
  const router = useRouter();
  return (
    <Screen>
      <EmptyState
        title="No encontramos esa página"
        description="El enlace puede estar mal escrito o ya no existir."
        actionLabel="Ir al inicio"
        onAction={() => router.replace('/')}
      />
    </Screen>
  );
}
