import type { Session } from '@/shared/api';

/**
 * Estado global de la sesión (plan, HU-0.3):
 * - `loading` (cargando): aún se está leyendo la sesión guardada.
 * - `authenticated` (autenticado): cuenta con Google o Apple.
 * - `guest` (invitado): sesión anónima de Supabase ("Continuar como invitado").
 * - `anonymous` (anónimo): sin sesión; solo el rol anon de Supabase.
 */
export type SessionStatus = 'loading' | 'authenticated' | 'guest' | 'anonymous';

export function statusFromSession(session: Session | null): Exclude<SessionStatus, 'loading'> {
  if (!session) return 'anonymous';
  return session.user.is_anonymous ? 'guest' : 'authenticated';
}
