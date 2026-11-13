import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Appearance } from 'react-native';
import type { ThemePreference } from '@/shared/ui';
import { ThemeRoot } from './ThemeRoot';

const mockPref: { value: ThemePreference } = { value: 'system' };
jest.mock('@/features/theme-switch', () => ({
  useThemePreference: () => mockPref.value,
  useThemeProfileSync: () => {},
}));

describe('ThemeRoot', () => {
  const setColorScheme = jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => {});
  beforeEach(() => {
    setColorScheme.mockClear();
  });

  it.each<[ThemePreference, 'light' | 'dark' | 'unspecified']>([
    ['dark', 'dark'],
    ['light', 'light'],
    ['system', 'unspecified'],
  ])('preferencia %s → interfaz nativa en %s', async (preference, expected) => {
    mockPref.value = preference;
    await render(<ThemeRoot>{null}</ThemeRoot>);
    expect(setColorScheme).toHaveBeenLastCalledWith(expected);
  });
});
