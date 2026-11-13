import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { APP_NAME } from '@/shared/config';
import { Screen } from '@/shared/ui';

export function AboutScreen() {
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

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700' },
  body: { fontSize: 16, textAlign: 'center' },
  link: { fontSize: 16, color: '#208AEF', paddingVertical: 8 },
});
