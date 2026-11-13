import 'i18next';
import type es from './locales/es.json';

// Las claves de t() se comprueban al compilar contra el archivo en español: una clave mal escrita
// o que no existe no compila.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof es };
  }
}
