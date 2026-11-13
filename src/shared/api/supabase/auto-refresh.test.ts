import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AppState, type AppStateStatus } from 'react-native';
import { syncAutoRefreshWithAppState } from './auto-refresh';
import { supabase } from './client';

jest.mock('./client', () => ({
  supabase: {
    auth: { startAutoRefresh: jest.fn(async () => {}), stopAutoRefresh: jest.fn(async () => {}) },
  },
}));

const auth = jest.mocked(supabase.auth);
let onChange: ((state: AppStateStatus) => void) | undefined;
const remove = jest.fn();

describe('syncAutoRefreshWithAppState', () => {
  beforeEach(() => {
    auth.startAutoRefresh.mockClear();
    auth.stopAutoRefresh.mockClear();
    remove.mockClear();
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, listener) => {
      onChange = listener as (state: AppStateStatus) => void;
      return { remove } as ReturnType<typeof AppState.addEventListener>;
    });
  });

  it('arranca el refresco si la app ya está al frente', () => {
    Object.defineProperty(AppState, 'currentState', { value: 'active', configurable: true });
    syncAutoRefreshWithAppState();
    expect(auth.startAutoRefresh).toHaveBeenCalledTimes(1);
  });

  it('lo para en segundo plano y lo reanuda al volver', () => {
    Object.defineProperty(AppState, 'currentState', { value: 'active', configurable: true });
    syncAutoRefreshWithAppState();
    onChange?.('background');
    expect(auth.stopAutoRefresh).toHaveBeenCalledTimes(1);
    onChange?.('active');
    expect(auth.startAutoRefresh).toHaveBeenCalledTimes(2);
  });

  it('al soltarlo deja de escuchar y para el refresco', () => {
    Object.defineProperty(AppState, 'currentState', { value: 'background', configurable: true });
    const stop = syncAutoRefreshWithAppState();
    expect(auth.startAutoRefresh).not.toHaveBeenCalled();
    stop();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(auth.stopAutoRefresh).toHaveBeenCalledTimes(2);
  });
});
