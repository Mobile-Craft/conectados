import { Link, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { PackCard } from '@/entities/pack';
import { intensityText } from '@/entities/question';
import { APP_NAME } from '@/shared/config';
import { createStyles, Screen, Text } from '@/shared/ui';

// Sets de muestra hasta que llegue el catálogo (E2): sirven para recorrer la navegación.
const SAMPLE_PACKS = [
  { slug: 'viejos-amigos', title: 'Viejos amigos', count: 24, level: 4 as const, label: 'Intensa' },
  { slug: 'primera-cita', title: 'Primera cita', count: 18, level: 2 as const, label: 'Tranquila' },
];

/** Pestaña Descubrir: punto de entrada de la app. */
export function DiscoverScreen() {
  const styles = useStyles();
  const router = useRouter();
  return (
    <Screen centered={false} safeTop style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title1" accessibilityRole="header">
          {APP_NAME}
        </Text>
        <Text tone="secondary">Sets de preguntas para cada momento.</Text>
        {SAMPLE_PACKS.map((pack) => (
          <PackCard
            key={pack.slug}
            title={pack.title}
            questionCount={pack.count}
            intensityText={intensityText({ level: pack.level, label: pack.label })}
            onPress={() => router.push({ pathname: '/pack/[slug]', params: { slug: pack.slug } })}
          />
        ))}
        {__DEV__ ? (
          <Link href="/dev/components" style={styles.link}>
            Catálogo de componentes
          </Link>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  screen: { padding: 0 },
  content: { padding: t.space[5], gap: t.space[4] },
  link: { ...t.type.label, color: t.colors.accent, paddingVertical: t.space[3] },
}));
