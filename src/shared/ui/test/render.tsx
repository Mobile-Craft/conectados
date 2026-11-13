import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, type ColorScheme } from '../theme';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

/** Monta un componente con el tema elegido y el área segura de un iPhone, para las pruebas. */
export function renderWithTheme(ui: ReactElement, scheme: ColorScheme = 'light') {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ThemeProvider preference={scheme}>{ui}</ThemeProvider>
    </SafeAreaProvider>,
  );
}
