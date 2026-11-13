import { useRouter } from 'expo-router';
import { Button, Screen } from '@/shared/ui';

/** Pestaña Perfil: de aquí cuelgan ajustes y la información de la app. */
export function ProfileScreen() {
  const router = useRouter();
  return (
    <Screen centered={false}>
      <Button
        label="Ajustes"
        variant="secondary"
        fullWidth
        onPress={() => router.push('/settings')}
      />
      <Button
        label="Acerca de"
        variant="secondary"
        fullWidth
        onPress={() => router.push('/about')}
      />
    </Screen>
  );
}
