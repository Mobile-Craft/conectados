import { View } from 'react-native';
import { i18n, useTranslation } from '@/shared/lib';
import { Card, createStyles, GradientFill, Text, useTheme } from '@/shared/ui';

export interface PackCardProps {
  title: string;
  questionCount: number;
  /** La intensidad del set, ya escrita con número y etiqueta (por ejemplo, "Intensa · 4"). */
  intensityText?: string;
  onPress?: () => void;
}

/** "24 preguntas", "1 pregunta", con el plural y el número del idioma activo. */
export function questionCountText(count: number): string {
  return i18n.t('pack.questions', { count });
}

/**
 * Tarjeta de un set: portada en degradado, título y resumen. Con `onPress` toda la tarjeta es un
 * botón y el lector de pantalla la lee como una sola cosa.
 */
export function PackCard({ title, questionCount, intensityText, onPress }: PackCardProps) {
  const styles = useStyles();
  const { components, radius } = useTheme();
  const { t } = useTranslation();
  const summary = [questionCountText(questionCount), intensityText].filter(Boolean).join(' · ');

  return (
    <Card
      radius="xl"
      padding={3}
      onPress={onPress}
      accessibilityLabel={`${title}. ${summary}`}
      accessibilityHint={onPress ? t('pack.openHint') : undefined}
      style={styles.card}
    >
      <View style={styles.cover}>
        <GradientFill colors={components.chip.selectedGradient} borderRadius={radius.lg} />
      </View>
      <View style={styles.meta}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption" tone="secondary">
          {summary}
        </Text>
      </View>
    </Card>
  );
}

const useStyles = createStyles((t) => ({
  card: { flexDirection: 'row', alignItems: 'center', gap: t.space[3], alignSelf: 'stretch' },
  cover: { width: 56, height: 56 },
  meta: { flex: 1, gap: 2 },
}));
