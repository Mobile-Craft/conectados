import { Link } from 'expo-router';
import { Text } from 'react-native';
import { APP_NAME } from '@/shared/config';
import { createStyles, Screen } from '@/shared/ui';

export function HomeScreen() {
  const styles = useStyles();
  return (
    <Screen>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.subtitle}>Bienvenido a la aplicación</Text>
      <Link href="/settings" style={styles.link}>
        Ajustes
      </Link>
      <Link href="/about" style={styles.link}>
        Acerca de
      </Link>
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  title: { ...t.type.questionL, color: t.colors.textPrimary },
  subtitle: { ...t.type.body, color: t.colors.textSecondary },
  link: { ...t.type.label, color: t.colors.accent, paddingVertical: t.space[3] },
}));
