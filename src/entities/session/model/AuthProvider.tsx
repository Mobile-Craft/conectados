import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, syncAutoRefreshWithAppState, type Session } from '@/shared/api';
import { statusFromSession, type SessionStatus } from './session-status';

export interface AuthState {
  status: SessionStatus;
  session: Session | null;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * Sigue la sesión de Supabase y la expone a toda la app. Supabase avisa primero con
 * INITIAL_SESSION, cuando ya leyó la sesión guardada; hasta entonces el estado es `loading`.
 * Si el refresh token deja de valer (revocado o caducado), Supabase emite SIGNED_OUT, borra la
 * sesión guardada y el estado pasa a `anonymous`. Sin red, conserva la sesión y reintenta.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', session: null });

  useEffect(() => {
    // El callback no llama a Supabase: hacerlo dentro de onAuthStateChange puede bloquearlo.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ status: statusFromSession(session), session });
    });
    const stopAutoRefresh = syncAutoRefreshWithAppState();
    return () => {
      data.subscription.unsubscribe();
      stopAutoRefresh();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth se usa dentro de <AuthProvider>.');
  return value;
}
