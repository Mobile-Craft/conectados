import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../button/Button';
import { GradientFill } from '../gradient/GradientFill';
import { Text } from '../text/Text';
import { createStyles, useTheme } from '../theme';

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Ilustración o icono; se oculta al lector de pantalla. Sin ella, un orbe con el degradado. */
  illustration?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

/** Lo que se muestra cuando no hay nada: qué pasa y, si se puede, qué hacer. */
export function EmptyState({
  title,
  description,
  illustration,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const styles = useStyles();
  const { components, radius } = useTheme();
  return (
    <View style={styles.root}>
      <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        {illustration ?? (
          <View style={styles.orb}>
            <GradientFill colors={components.chip.selectedGradient} borderRadius={radius.full} />
          </View>
        )}
      </View>
      <Text variant="title3" align="center" accessibilityRole="header">
        {title}
      </Text>
      {description ? (
        <Text tone="secondary" align="center">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        // El botón se ajusta a su texto; la envoltura lo deja centrado.
        <View>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  root: { alignItems: 'center', gap: t.space[3], padding: t.space[6] },
  orb: {
    width: 72,
    height: 72,
    marginBottom: t.space[2],
    shadowColor: t.colors.aurora[1],
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
}));
