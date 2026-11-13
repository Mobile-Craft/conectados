import { Text, View } from 'react-native';
import { ThemeSwitch } from '@/features/theme-switch';
import { useTranslation } from '@/shared/lib';
import { createStyles, Screen } from '@/shared/ui';

export function SettingsScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <Screen centered={false}>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>
          {t('settings.themeHeading')}
        </Text>
        <ThemeSwitch />
        <Text style={styles.help}>{t('settings.themeHelp')}</Text>
      </View>
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  section: { gap: t.space[3] },
  heading: { ...t.type.title3, color: t.colors.textPrimary },
  help: { ...t.type.callout, color: t.colors.textMuted },
}));
