import { useRouter } from 'expo-router';
import { useTranslation } from '@/shared/lib';
import { Button, Screen } from '@/shared/ui';

/** Pestaña Perfil: de aquí cuelgan ajustes y la información de la app. */
export function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Screen centered={false}>
      <Button
        label={t('nav.settings')}
        variant="secondary"
        fullWidth
        onPress={() => router.push('/settings')}
      />
      <Button
        label={t('nav.about')}
        variant="secondary"
        fullWidth
        onPress={() => router.push('/about')}
      />
    </Screen>
  );
}
