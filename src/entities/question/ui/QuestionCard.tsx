import { View } from 'react-native';
import { useTranslation } from '@/shared/lib';
import { Card, Chip, createStyles, Text } from '@/shared/ui';
import { intensitySpoken, intensityText, type Intensity } from '../model/intensity';
import { questionSize } from '../model/question-size';

export interface QuestionCardProps {
  text: string;
  /** Categoría que va encima de la pregunta, en versalitas (por ejemplo, "Confesión"). */
  category?: string;
  intensity?: Intensity;
  /** Etiquetas cortas que van debajo, junto a la intensidad. */
  tags?: readonly string[];
}

/**
 * La carta de la pregunta: cristal muy redondeado sobre la aurora, la pregunta en grande con su
 * tamaño según el largo y, abajo, la intensidad destacada y las etiquetas. El lector de pantalla
 * la lee de una vez, en orden.
 */
export function QuestionCard({ text, category, intensity, tags = [] }: QuestionCardProps) {
  const styles = useStyles();
  // Se vuelve a pintar al cambiar el idioma.
  useTranslation();
  const spoken = [category, text, intensity && intensitySpoken(intensity), ...tags]
    .filter(Boolean)
    .join('. ');

  return (
    <View accessible accessibilityRole="text" accessibilityLabel={spoken} style={styles.root}>
      <Card radius="xxl" padding={6} style={styles.card}>
        {category ? (
          <Text variant="overline" tone="secondary">
            {category}
          </Text>
        ) : null}
        <Text variant={questionSize(text)} style={styles.question}>
          {text}
        </Text>
        {intensity || tags.length > 0 ? (
          <View style={styles.chips}>
            {intensity ? <Chip label={intensityText(intensity)} highlighted /> : null}
            {tags.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </View>
        ) : null}
      </Card>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  root: { alignSelf: 'stretch' },
  card: { gap: t.space[5], minHeight: 240, justifyContent: 'space-between' },
  question: { color: t.components.questionCard.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: t.space[2] },
}));
