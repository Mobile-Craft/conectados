import { Link, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { PackCard } from '@/entities/pack';
import { intensityText } from '@/entities/question';
import { useTranslation } from '@/shared/lib';
import { createStyles, Screen, Text } from '@/shared/ui';

// Sets de muestra hasta que llegue el catálogo (E4): sirven para recorrer la navegación.
const SAMPLE_PACKS = [
  { slug: 'viejos-amigos', title: 'oldFriends', count: 24, level: 4, label: 'intense' },
  { slug: 'primera-cita', title: 'firstDate', count: 18, level: 2, label: 'calm' },
] as const;

/** Pestaña Descubrir: punto de entrada de la app. */
export function DiscoverScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Screen centered={false} safeTop style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="title1" accessibilityRole="header">
          {t('common.appName')}
        </Text>
        <Text tone="secondary">{t('discover.tagline')}</Text>
        {SAMPLE_PACKS.map((pack) => (
          <PackCard
            key={pack.slug}
            title={t(`sample.packs.${pack.title}`)}
            questionCount={pack.count}
            intensityText={intensityText({
              level: pack.level,
              label: t(`sample.intensity.${pack.label}`),
            })}
            onPress={() => router.push({ pathname: '/pack/[slug]', params: { slug: pack.slug } })}
          />
        ))}
        {__DEV__ ? (
          <Link href="/dev/components" style={styles.link}>
            {t('discover.devCatalog')}
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
