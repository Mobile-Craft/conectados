import { Redirect } from 'expo-router';
import { DevComponentsScreen } from '@/screens/dev-components';

/** Catálogo interno de componentes: solo en desarrollo; en producción vuelve al inicio. */
export default function DevComponentsRoute() {
  return __DEV__ ? <DevComponentsScreen /> : <Redirect href="/" />;
}
