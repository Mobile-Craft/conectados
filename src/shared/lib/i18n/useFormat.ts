import { useTranslation } from 'react-i18next';
import { isSupported, FALLBACK_LANGUAGE } from './detect';
import { formatDate, formatNumber, formatRelative } from './format';

/** Los formatos ligados al idioma activo; se actualizan al cambiarlo. */
export function useFormat() {
  const { i18n } = useTranslation();
  const language = isSupported(i18n.language) ? i18n.language : FALLBACK_LANGUAGE;
  return {
    language,
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, language, options),
    date: (date: Date | number, options?: Intl.DateTimeFormatOptions) =>
      formatDate(date, language, options),
    relative: (date: Date | number, now?: Date | number) => formatRelative(date, language, now),
  };
}
