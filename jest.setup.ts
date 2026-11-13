// Simulaciones globales para las pruebas: módulos nativos que no existen en Node.
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Las pruebas corren en español, el idioma principal: el teléfono simulado está en es-ES.
jest.mock('expo-localization', () => {
  const locales = [{ languageCode: 'es', languageTag: 'es-ES', regionCode: 'ES' }];
  return { getLocales: () => locales, useLocales: () => locales };
});
