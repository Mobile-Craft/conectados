import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { APP_NAME } from '@/shared/config';
import { Screen } from '@/shared/ui';

export function HomeScreen() {
  return (
    <Screen>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.subtitle}>Bienvenido a la aplicación</Text>
      <Link href="/about" style={styles.link}>
        Acerca de
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 32, fontWeight: '700' },
  subtitle: { fontSize: 16 },
  link: { fontSize: 16, color: '#208AEF', paddingVertical: 8 },
});
