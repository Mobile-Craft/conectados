import { describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/shared/ui';
import { useTransitions } from './transitions';

const mockMotion = { reduced: false };
jest.mock('@/shared/lib', () => ({ useReducedMotion: () => mockMotion.reduced }));

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider preference="light">{children}</ThemeProvider>
);

describe('useTransitions', () => {
  it('cada paso se mueve distinto, dentro de 180–240 ms', async () => {
    mockMotion.reduced = false;
    const { result } = await renderHook(() => useTransitions(), { wrapper });
    const t = result.current;
    expect(t.push.animation).toBe('ios_from_right');
    expect(t.modal.animation).toBe('slide_from_bottom');
    expect(t.game.animation).toBe('fade_from_bottom');
    expect(t.gameStep.animation).toBe('fade');
    expect(t.tabs.animation).toBe('fade');
    for (const step of [t.push, t.modal, t.game, t.gameStep]) {
      expect(step.animationDuration).toBeGreaterThanOrEqual(180);
      expect(step.animationDuration).toBeLessThanOrEqual(240);
    }
  });

  it('con "Reducir movimiento" nada se desplaza: todo funde', async () => {
    mockMotion.reduced = true;
    const { result } = await renderHook(() => useTransitions(), { wrapper });
    const t = result.current;
    for (const step of [t.push, t.modal, t.game, t.gameStep]) expect(step.animation).toBe('fade');
    expect(t.tabs.animation).toBe('none');
  });
});
