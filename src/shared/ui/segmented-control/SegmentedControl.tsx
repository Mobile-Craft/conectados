import { Pressable, Text, View } from 'react-native';
import { createStyles } from '../theme';

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
 * Elegir una opción entre pocas (2 a 4). Genérico: no conoce el dominio. Se anuncia como grupo
 * de opciones (radio) y cada segmento mide al menos 44 pt de alto.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const styles = useStyles();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={styles.group}
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
            style={({ pressed }) => [
              styles.segment,
              selected && styles.selected,
              pressed && !selected && styles.pressed,
            ]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
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
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surfaceSunken,
    borderWidth: 1,
    borderColor: t.components.chip.border,
  },
  segment: {
    flex: 1,
    minHeight: t.minTouchTarget,
    paddingHorizontal: t.space[3],
    paddingVertical: t.space[2],
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: t.components.chip.selectedBg,
    borderColor: t.components.chip.selectedBorder,
  },
  pressed: { backgroundColor: t.components.chip.bg },
  label: { ...t.type.label, color: t.components.chip.text, textAlign: 'center' },
  selectedLabel: { color: t.components.chip.selectedText },
}));
