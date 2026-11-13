// Simulaciones globales para las pruebas: módulos nativos que no existen en Node.
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
