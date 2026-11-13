import { SegmentedControl, type SegmentedOption, type ThemePreference } from '@/shared/ui';
import { useThemePreferenceStore } from '../model/theme-preference-store';

// Textos en español hasta que llegue i18n.
const OPTIONS: readonly SegmentedOption<ThemePreference>[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Automático' },
];

/** Elegir tema claro, oscuro o el del sistema. El cambio se aplica al instante. */
export function ThemeSwitch() {
  const preference = useThemePreferenceStore((s) => s.preference);
  const setPreference = useThemePreferenceStore((s) => s.setPreference);
  return (
    <SegmentedControl
      accessibilityLabel="Tema"
      options={OPTIONS}
      value={preference}
      onChange={setPreference}
    />
  );
}
