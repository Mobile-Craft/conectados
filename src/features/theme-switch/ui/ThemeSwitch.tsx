import { useTranslation } from '@/shared/lib';
import { SegmentedControl, THEME_PREFERENCES } from '@/shared/ui';
import { useThemePreferenceStore } from '../model/theme-preference-store';

/** Elegir tema claro, oscuro o el del sistema. El cambio se aplica al instante. */
export function ThemeSwitch() {
  const preference = useThemePreferenceStore((s) => s.preference);
  const setPreference = useThemePreferenceStore((s) => s.setPreference);
  const { t } = useTranslation();
  const options = THEME_PREFERENCES.map((value) => ({ value, label: t(`theme.${value}`) }));
  return (
    <SegmentedControl
      accessibilityLabel={t('theme.label')}
      options={options}
      value={preference}
      onChange={setPreference}
    />
  );
}
