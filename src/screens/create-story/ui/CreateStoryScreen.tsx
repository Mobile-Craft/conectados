import { useRouter } from 'expo-router';
import { Button, EmptyState, Screen } from '@/shared/ui';

/** Crear historia, como hoja modal. El flujo de escribir o narrar llega con E7. */
export function CreateStoryScreen() {
  const router = useRouter();
  return (
    <Screen>
      <EmptyState title="Nueva historia" description="Aquí escribirás o narrarás tu historia." />
      <Button label="Cerrar" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
