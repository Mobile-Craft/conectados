import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { GradientFill } from '../gradient/GradientFill';
import { createStyles, useTheme } from '../theme';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Lo que lee el lector de pantalla para el grupo entero. */
  accessibilityLabel: string;
}

/**
 * Elegir una opción entre pocas (2 a 4), en una píldora de cristal; la elegida lleva el degradado
 * del acento. Genérico: no conoce el dominio. Se anuncia como grupo de opciones (radio) y cada
 * segmento mide al menos 44 pt de alto.
 */
/**
 * ¿Caben las opciones en fila? Se estima el ancho de la etiqueta más larga con el tamaño de texto
 * del sistema; si no cabe en su parte, se apilan, para no partir una palabra en sílabas.
 */
export function fitsInRow(labels: readonly string[], width: number, fontScale: number): boolean {
  const longest = Math.max(0, ...labels.map((label) => Array.from(label).length));
  const labelWidth = longest * 15 * 0.55 * fontScale + 24;
  const available = (width - 48 - 8) / Math.max(labels.length, 1);
  return labelWidth <= available;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const styles = useStyles();
  const { components, radius, maxFontScale } = useTheme();
  const { width, fontScale: systemScale } = useWindowDimensions();
  const fontScale = Math.min(systemScale, maxFontScale.label ?? systemScale);
  const row = fitsInRow(
    options.map((o) => o.label),
    width,
    fontScale,
  );
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[styles.group, !row && styles.stacked]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [styles.segment, pressed && !selected && styles.pressed]}
          >
            {selected ? (
              <GradientFill colors={components.chip.selectedGradient} borderRadius={radius.full} />
            ) : null}
            <Text
              maxFontSizeMultiplier={maxFontScale.label}
              style={[styles.label, selected && styles.selectedLabel]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  group: {
    flexDirection: 'row',
    gap: t.space[1],
    padding: t.space[1],
    borderRadius: t.radius.full,
    backgroundColor: t.components.glass.bg,
    borderWidth: 1,
    borderColor: t.components.glass.border,
  },
  stacked: { flexDirection: 'column', borderRadius: t.radius.xl },
  // En columna, cada opción toma la altura de su texto (con flex: 1 se aplastaría).
  segmentStacked: { flex: 0 },
  segment: {
    flex: 1,
    minHeight: t.minTouchTarget,
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2],
    borderRadius: t.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: t.components.chip.bgPressed },
  label: { ...t.type.label, color: t.components.chip.text, textAlign: 'center' },
  selectedLabel: { color: t.components.chip.selectedText },
}));
