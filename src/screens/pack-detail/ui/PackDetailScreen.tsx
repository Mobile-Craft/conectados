import { useRouter } from 'expo-router';
import { useTranslation } from '@/shared/lib';
import { Button, Screen, Text } from '@/shared/ui';

/**
 * Detalle de un set (se abre también desde conectados://pack/<slug>). El contenido llega con el
 * catálogo (E2); aquí ya se ve qué set es y se puede empezar la partida.
 */
export function PackDetailScreen({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Screen>
      <Text variant="overline" tone="secondary">
        {t('pack.kicker')}
      </Text>
      <Text variant="title1" align="center" accessibilityRole="header">
        {slug}
      </Text>
      <Button
        label={t('pack.play')}
        size="lg"
        onPress={() => router.push({ pathname: '/game', params: { pack: slug } })}
      />
    </Screen>
  );
}
