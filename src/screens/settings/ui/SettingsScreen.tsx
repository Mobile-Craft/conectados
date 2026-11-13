import { Text, View } from 'react-native';
import { ThemeSwitch } from '@/features/theme-switch';
import { createStyles, Screen } from '@/shared/ui';

export function SettingsScreen() {
  const styles = useStyles();
  return (
    <Screen centered={false}>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>
          Tema
        </Text>
        <ThemeSwitch />
        <Text style={styles.help}>Automático sigue el modo claro u oscuro de tu teléfono.</Text>
      </View>
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  section: { gap: t.space[3] },
  heading: { ...t.type.title3, color: t.colors.textPrimary },
  help: { ...t.type.callout, color: t.colors.textMuted },
}));
