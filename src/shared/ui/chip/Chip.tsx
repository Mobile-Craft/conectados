import { Pressable, View } from 'react-native';
import { GradientFill } from '../gradient/GradientFill';
import { Text } from '../text/Text';
import { createStyles, useTheme } from '../theme';

/** Paso de una escala graduada de 1 a 5 (por ejemplo, una intensidad). */
export type ChipScale = 1 | 2 | 3 | 4 | 5;

export interface ChipProps {
  label: string;
  /** Si se pasa, el chip es un interruptor (seleccionable). */
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  /** Destaca un chip informativo con el degradado del acento, como uno elegido. */
  highlighted?: boolean;
  /** Colorea el chip con el paso de la escala; el texto debe decir el valor (no solo el color). */
  scale?: ChipScale;
  accessibilityLabel?: string;
}

/**
 * Etiqueta corta en píldora de cristal. Elegida o destacada, lleva el degradado del acento. Sin
 * `onPress` es solo informativa; con `onPress` es un interruptor y su área táctil llega a 52 pt.
 */
export function Chip({
  label,
  onPress,
  selected = false,
  disabled = false,
  highlighted = false,
  scale,
  accessibilityLabel,
}: ChipProps) {
  const styles = useStyles();
  const { components, radius } = useTheme();
  const graded = scale ? components.chipIntensity[scale - 1] : undefined;
  const accent = !graded && (selected || highlighted);
  const textColor = graded?.text ?? (accent ? components.chip.selectedText : components.chip.text);
  const tone = graded
    ? { backgroundColor: graded.bg, borderColor: graded.bg }
    : accent
      ? styles.accent
      : undefined;

  const content = (
    <>
      {accent ? (
        <GradientFill colors={components.chip.selectedGradient} borderRadius={radius.full} />
      ) : null}
      <Text variant="caption" style={{ color: textColor }}>
        {label}
      </Text>
    </>
  );

  if (!onPress) {
    return (
      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={accessibilityLabel ?? label}
        style={[styles.base, tone]}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="togglebutton"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        styles.interactive,
        tone,
        pressed && !accent && !graded && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {content}
    </Pressable>
  );
}

const useStyles = createStyles((t) => ({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.space[3],
    paddingVertical: 6,
    borderRadius: t.radius.full,
    borderWidth: 1,
    borderColor: t.components.chip.border,
    backgroundColor: t.components.chip.bg,
  },
  interactive: { minHeight: t.minTouchTarget - 8, justifyContent: 'center' },
  accent: { borderColor: 'transparent', backgroundColor: 'transparent' },
  pressed: { backgroundColor: t.components.chip.bgPressed },
  disabled: { opacity: 0.45 },
}));
