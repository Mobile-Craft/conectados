import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';
import { GradientFill } from '../gradient/GradientFill';
import { Text } from '../text/Text';
import { createStyles, useTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Muestra un indicador y bloquea el botón mientras dura una acción. */
  loading?: boolean;
  disabled?: boolean;
  /**
   * Ocupa todo el ancho disponible. Sin él, el botón se alinea como diga su contenedor
   * (`alignItems`): centrado en una pantalla centrada, a la izquierda en una fila.
   */
  fullWidth?: boolean;
}

/**
 * Botón en píldora con variantes y estados: normal, presionado, deshabilitado y cargando. El
 * principal lleva el degradado del acento con un halo; el secundario es de cristal. Mide al
 * menos 44 pt de alto y se anuncia como botón con su estado.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
  ...rest
}: ButtonProps) {
  const styles = useStyles();
  const { components, radius } = useTheme();
  const tokens = components.button;
  const textColor = tokens[variant].text;
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        pressed && styles[`${variant}Pressed`],
        pressed && styles.pressed,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      {...rest}
    >
      {({ pressed }) => (
        <>
          {variant === 'primary' ? (
            <GradientFill
              colors={pressed ? tokens.primary.gradientPressed : tokens.primary.gradient}
              borderRadius={radius.full}
            />
          ) : null}
          <View style={styles.content}>
            {loading ? <ActivityIndicator size="small" color={textColor} /> : null}
            <Text variant="label" style={{ color: textColor }} align="center">
              {label}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}

const useStyles = createStyles((t) => {
  const b = t.components.button;
  return {
    base: {
      minHeight: t.minTouchTarget,
      borderRadius: t.radius.full,
      borderWidth: 1,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    md: { paddingHorizontal: t.space[5], paddingVertical: t.space[2] },
    lg: { minHeight: 52, paddingHorizontal: t.space[8], paddingVertical: t.space[3] },
    content: { flexDirection: 'row', alignItems: 'center', gap: t.space[2] },
    primary: {
      shadowColor: b.primary.glow,
      shadowOpacity: t.scheme === 'dark' ? 0.55 : 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
    primaryPressed: { shadowOpacity: 0.2 },
    secondary: { backgroundColor: b.secondary.bg, borderColor: b.secondary.border },
    secondaryPressed: { backgroundColor: b.secondary.bgPressed },
    ghost: { backgroundColor: b.ghost.bg },
    ghostPressed: { backgroundColor: b.ghost.bgPressed },
    danger: { backgroundColor: b.danger.bg },
    dangerPressed: { opacity: 0.85 },
    pressed: { transform: [{ scale: 0.98 }] },
    fullWidth: { alignSelf: 'stretch' },
    disabled: { opacity: 0.45 },
  };
});
