/** Lo mínimo que necesita el adaptador de un almacén clave-valor asíncrono (SecureStore). */
export interface KeyValueStore {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}

/** Interfaz que espera supabase-js para guardar la sesión. */
export interface SessionStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// SecureStore no garantiza valores de más de 2048 bytes y una sesión de Supabase suele pasarlos.
// En UTF-8 cada unidad de UTF-16 ocupa como mucho 3 bytes, así que 600 unidades caben en 1800.
export const CHUNK_UNITS = 600;

const chunkKey = (key: string, index: number) => `${key}.${index}`;

function isHighSurrogate(code: number) {
  return code >= 0xd800 && code <= 0xdbff;
}

/** Parte el texto sin cortar nunca un par sustituto (un emoji, por ejemplo). */
export function splitIntoChunks(value: string, size = CHUNK_UNITS): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < value.length) {
    let end = Math.min(start + size, value.length);
    if (end < value.length && isHighSurrogate(value.charCodeAt(end - 1))) end -= 1;
    chunks.push(value.slice(start, end));
    start = end;
  }
  return chunks;
}

/**
 * Guarda cada valor en trozos: `key` lleva el número de trozos y `key.0`, `key.1`… el contenido.
 * Si falta un trozo, el valor se da por perdido (null) y Supabase pide iniciar sesión de nuevo.
 */
export function createChunkedStorage(store: KeyValueStore): SessionStorage {
  async function readCount(key: string): Promise<number> {
    const raw = await store.getItemAsync(key);
    const count = raw === null ? 0 : Number.parseInt(raw, 10);
    return Number.isInteger(count) && count > 0 ? count : 0;
  }

  async function deleteChunks(key: string, from: number, to: number) {
    for (let i = from; i < to; i += 1) await store.deleteItemAsync(chunkKey(key, i));
  }

  return {
    async getItem(key) {
      const count = await readCount(key);
      if (count === 0) return null;
      const chunks: string[] = [];
      for (let i = 0; i < count; i += 1) {
        const chunk = await store.getItemAsync(chunkKey(key, i));
        if (chunk === null) return null;
        chunks.push(chunk);
      }
      return chunks.join('');
    },

    async setItem(key, value) {
      const previous = await readCount(key);
      const chunks = splitIntoChunks(value);
      for (const [i, chunk] of chunks.entries()) await store.setItemAsync(chunkKey(key, i), chunk);
      await store.setItemAsync(key, String(chunks.length));
      await deleteChunks(key, chunks.length, previous);
    },

    async removeItem(key) {
      const count = await readCount(key);
      await store.deleteItemAsync(key);
      await deleteChunks(key, 0, count);
    },
  };
}
