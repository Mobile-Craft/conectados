import { describe, expect, it } from '@jest/globals';
import {
  CHUNK_UNITS,
  createChunkedStorage,
  splitIntoChunks,
  type KeyValueStore,
} from './chunked-storage';

function memoryStore() {
  const data = new Map<string, string>();
  const store: KeyValueStore = {
    getItemAsync: async (key) => data.get(key) ?? null,
    setItemAsync: async (key, value) => {
      // Igual que SecureStore: claves solo con letras, números, ".", "-" y "_".
      if (!/^[\w.-]+$/.test(key)) throw new Error(`Clave no válida: ${key}`);
      data.set(key, value);
    },
    deleteItemAsync: async (key) => {
      data.delete(key);
    },
  };
  return { data, store };
}

const KEY = 'sb-abcdefghijklmnop-auth-token';
const utf8Bytes = (s: string) => new TextEncoder().encode(s).length;

describe('splitIntoChunks', () => {
  it('no corta un emoji entre dos trozos', () => {
    const value = `${'a'.repeat(CHUNK_UNITS - 1)}😀${'b'.repeat(10)}`;
    const chunks = splitIntoChunks(value);
    expect(chunks.join('')).toBe(value);
    expect(chunks[0]).toHaveLength(CHUNK_UNITS - 1);
    expect(chunks[1]?.startsWith('😀')).toBe(true);
  });

  it('cada trozo cabe en 2048 bytes aunque todo sea multibyte', () => {
    const value = 'ñ€😀'.repeat(2000);
    for (const chunk of splitIntoChunks(value)) expect(utf8Bytes(chunk)).toBeLessThanOrEqual(2048);
  });
});

describe('createChunkedStorage', () => {
  it('devuelve null si no hay nada guardado', async () => {
    const { store } = memoryStore();
    await expect(createChunkedStorage(store).getItem(KEY)).resolves.toBeNull();
  });

  it('guarda y recupera una sesión grande con acentos y emoji', async () => {
    const { data, store } = memoryStore();
    const storage = createChunkedStorage(store);
    const session = JSON.stringify({
      access_token: 'x'.repeat(1200),
      refresh_token: 'r'.repeat(40),
      user: { user_metadata: { full_name: 'Tavárez 😀', bio: 'ñ'.repeat(3000) } },
    });
    await storage.setItem(KEY, session);
    expect(Number(data.get(KEY))).toBeGreaterThan(1);
    for (const [key, value] of data)
      if (key !== KEY) expect(utf8Bytes(value)).toBeLessThanOrEqual(2048);
    await expect(storage.getItem(KEY)).resolves.toBe(session);
  });

  it('al guardar un valor más corto borra los trozos sobrantes', async () => {
    const { data, store } = memoryStore();
    const storage = createChunkedStorage(store);
    await storage.setItem(KEY, 'a'.repeat(CHUNK_UNITS * 4));
    await storage.setItem(KEY, 'corto');
    expect([...data.keys()].sort()).toEqual([KEY, `${KEY}.0`]);
    await expect(storage.getItem(KEY)).resolves.toBe('corto');
  });

  it('removeItem lo borra todo', async () => {
    const { data, store } = memoryStore();
    const storage = createChunkedStorage(store);
    await storage.setItem(KEY, 'a'.repeat(CHUNK_UNITS * 3));
    await storage.removeItem(KEY);
    expect(data.size).toBe(0);
    await expect(storage.getItem(KEY)).resolves.toBeNull();
  });

  it('si falta un trozo, la sesión se da por perdida', async () => {
    const { data, store } = memoryStore();
    const storage = createChunkedStorage(store);
    await storage.setItem(KEY, 'a'.repeat(CHUNK_UNITS * 3));
    data.delete(`${KEY}.1`);
    await expect(storage.getItem(KEY)).resolves.toBeNull();
  });

  it('ignora un contador corrupto', async () => {
    const { data, store } = memoryStore();
    data.set(KEY, 'basura');
    await expect(createChunkedStorage(store).getItem(KEY)).resolves.toBeNull();
  });
});
