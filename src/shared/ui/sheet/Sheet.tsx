import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '@/shared/lib';
import { Button } from '../button/Button';
import { Text } from '../text/Text';
import { createStyles, useTheme } from '../theme';

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Texto del botón de cerrar. */
  closeLabel?: string;
}

/**
 * Hoja de cristal que sube desde abajo sobre un velo. Se cierra con su botón, tocando el velo o
 * con el botón atrás de Android. El lector de pantalla queda dentro de la hoja mientras está
 * abierta. En Android, sin desenfoque, la hoja es opaca.
 */
export function Sheet({ visible, onClose, title, children, closeLabel = 'Cerrar' }: SheetProps) {
  const styles = useStyles();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const blurred = Platform.OS === 'ios';

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reducedMotion ? 'fade' : 'slide'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        {/* El velo cierra al tocarlo, pero el lector de pantalla no lo ve: ya tiene el botón de
            cerrar, y así no oye "Cerrar" dos veces. */}
        <Pressable
          accessible={false}
          importantForAccessibility="no"
          accessibilityElementsHidden
          onPress={onClose}
          style={styles.overlay}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            !blurred && styles.opaque,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {blurred ? (
            <>
              <BlurView
                intensity={theme.blur.sheet}
                tint={theme.scheme === 'dark' ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.glass]} />
            </>
          ) : null}
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text variant="title3" accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
            <Button label={closeLabel} variant="ghost" onPress={onClose} />
          </View>
          <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const useStyles = createStyles((t) => ({
  root: { flex: 1, justifyContent: 'flex-end' },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: t.components.sheet.overlay,
  },
  sheet: {
    maxHeight: '90%',
    overflow: 'hidden',
    borderTopLeftRadius: t.radius.xxl,
    borderTopRightRadius: t.radius.xxl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: t.components.sheet.border,
    paddingTop: t.space[2],
  },
  opaque: { backgroundColor: t.components.sheet.fallbackBg },
  glass: { backgroundColor: t.components.sheet.bg },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: t.radius.full,
    backgroundColor: t.components.sheet.handle,
    marginBottom: t.space[2],
  },
  // Si el título no cabe junto a "Cerrar" (texto del sistema grande), el botón baja a otra línea
  // en vez de aplastar el título hasta partirlo en sílabas.
  header: {
    paddingHorizontal: t.space[5],
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.space[2],
  },
  title: { flexGrow: 1, flexShrink: 0, maxWidth: '100%' },
  // El margen va dentro del scroll: así el halo de un botón no se corta por los lados.
  content: {
    gap: t.space[3],
    paddingTop: t.space[3],
    paddingBottom: t.space[6],
    paddingHorizontal: t.space[5],
  },
}));
