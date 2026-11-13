import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '@/shared/lib';
import { Text } from '../text/Text';
import { createStyles, useTheme } from '../theme';

export interface ToastProps {
  visible: boolean;
  message: string;
  /** Se llama cuando el aviso termina su tiempo o se toca su acción. */
  onHide: () => void;
  /** Tiempo en pantalla, en ms. Por defecto, 4 s; con acción, 6 s para dar tiempo a leerla. */
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Aviso breve que aparece abajo y se va solo. El lector de pantalla lo anuncia sin mover el
 * foco. Con "Reducir movimiento" solo aparece y desaparece, sin subir. Genérico: no conoce el
 * dominio; quien lo usa decide cuándo mostrarlo.
 */
export function Toast({ visible, message, onHide, duration, actionLabel, onAction }: ToastProps) {
  const styles = useStyles();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));
  const [mounted, setMounted] = useState(visible);
  const hasAction = Boolean(actionLabel && onAction);
  const timeout = duration ?? (hasAction ? 6000 : 4000);
  // Se monta en cuanto pide mostrarse; se desmonta al terminar de irse (al final de la animación).
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: theme.duration.base,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
  }, [visible, progress, theme.duration.base]);

  useEffect(() => {
    if (!visible) return;
    AccessibilityInfo.announceForAccessibility(message);
    const timer = setTimeout(onHide, timeout);
    return () => clearTimeout(timer);
  }, [visible, message, timeout, onHide]);

  if (!mounted) return null;

  const translateY = reducedMotion
    ? 0
    : progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.root,
        { bottom: Math.max(insets.bottom, 16), opacity: progress, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.toast}>
        <Text
          variant="callout"
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={styles.message}
        >
          {message}
        </Text>
        {hasAction ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            onPress={() => {
              onAction?.();
              onHide();
            }}
            hitSlop={8}
            style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
          >
            <Text variant="label" style={styles.actionLabel}>
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

const useStyles = createStyles((t) => ({
  root: { position: 'absolute', left: t.space[4], right: t.space[4], alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.space[3],
    maxWidth: 560,
    alignSelf: 'stretch',
    paddingLeft: t.space[5],
    paddingRight: t.space[2],
    paddingVertical: t.space[2],
    minHeight: 52,
    borderRadius: t.radius.xl,
    backgroundColor: t.components.toast.bg,
    shadowColor: t.colors.aurora[2],
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  message: { flex: 1, color: t.components.toast.text, paddingVertical: t.space[1] },
  action: {
    minHeight: t.minTouchTarget,
    paddingHorizontal: t.space[3],
    borderRadius: t.radius.full,
    justifyContent: 'center',
  },
  actionPressed: { opacity: 0.7 },
  actionLabel: { color: t.components.toast.text, textDecorationLine: 'underline' },
}));
