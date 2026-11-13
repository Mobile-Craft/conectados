import { LANGUAGE_PREFERENCES, useTranslation } from '@/shared/lib';
import { SegmentedControl } from '@/shared/ui';
import { useLanguagePreferenceStore } from '../model/language-preference-store';

/**
 * Elegir el idioma de la app: el del teléfono (Automático), español o inglés. El cambio se
 * aplica al instante, sin reiniciar. Cada idioma se nombra en sí mismo para encontrarlo aunque
 * no se entienda el actual.
 */
export function LanguageSwitch() {
  const preference = useLanguagePreferenceStore((s) => s.preference);
  const setPreference = useLanguagePreferenceStore((s) => s.setPreference);
  const { t } = useTranslation();
  const options = LANGUAGE_PREFERENCES.map((value) => ({ value, label: t(`language.${value}`) }));
  return (
    <SegmentedControl
      accessibilityLabel={t('language.label')}
      options={options}
      value={preference}
      onChange={setPreference}
    />
  );
}
