import { ScrollView, Text, View } from 'react-native';
import { LanguageSwitch } from '@/features/language-switch';
import { ThemeSwitch } from '@/features/theme-switch';
import { useTranslation } from '@/shared/lib';
import { createStyles, Screen } from '@/shared/ui';

export function SettingsScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <Screen centered={false} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>
            {t('settings.themeHeading')}
          </Text>
          <ThemeSwitch />
          <Text style={styles.help}>{t('settings.themeHelp')}</Text>
        </View>
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>
            {t('settings.languageHeading')}
          </Text>
          <LanguageSwitch />
          <Text style={styles.help}>{t('settings.languageHelp')}</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  // El margen lo pone el scroll, para que el contenido no se corte en los bordes al desplazarse.
  screen: { padding: 0 },
  content: { padding: t.space[6], gap: t.space[8] },
  section: { gap: t.space[3] },
  heading: { ...t.type.title3, color: t.colors.textPrimary },
  help: { ...t.type.callout, color: t.colors.textMuted },
}));
