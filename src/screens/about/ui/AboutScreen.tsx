import { Text } from 'react-native';
import { useTranslation } from '@/shared/lib';
import { createStyles, Screen } from '@/shared/ui';

export function AboutScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <Screen>
      <Text accessibilityRole="header" style={styles.title}>
        {t('about.title', { appName: t('common.appName') })}
      </Text>
      <Text style={styles.body}>{t('about.body')}</Text>
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  title: { ...t.type.title2, color: t.colors.textPrimary },
  body: { ...t.type.body, color: t.colors.textSecondary, textAlign: 'center' },
}));
