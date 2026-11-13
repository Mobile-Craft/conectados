import { Link } from 'expo-router';
import { Text } from 'react-native';
import { APP_NAME } from '@/shared/config';
import { createStyles, Screen } from '@/shared/ui';

export function AboutScreen() {
  const styles = useStyles();
  return (
    <Screen>
      <Text style={styles.title}>Acerca de {APP_NAME}</Text>
      <Text style={styles.body}>Esta es la segunda pantalla de la aplicación.</Text>
      <Link href="/" style={styles.link}>
        Volver al inicio
      </Link>
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  title: { ...t.type.title2, color: t.colors.textPrimary },
  body: { ...t.type.body, color: t.colors.textSecondary, textAlign: 'center' },
  link: { ...t.type.label, color: t.colors.accent, paddingVertical: t.space[3] },
}));
