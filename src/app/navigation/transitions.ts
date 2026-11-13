import { useReducedMotion } from '@/shared/lib';
import { useTheme } from '@/shared/ui';

/**
 * Transiciones entre pantallas (HU-1.4), iguales en iOS y Android y con la duración de los
 * tokens (180–240 ms). Cada tipo de paso se mueve distinto, para que se entienda dónde se está:
 * - apilar (un set, ajustes) entra desde la derecha;
 * - un modal (crear historia) sube desde abajo;
 * - la partida aparece desde abajo con un fundido: se entra en otro modo;
 * - dentro de la partida, y entre pestañas, solo funde.
 * Con "Reducir movimiento", nada se desplaza: todo funde (y las pestañas cambian sin animación).
 */
export function useTransitions() {
  const reduced = useReducedMotion();
  const { duration } = useTheme();
  const fade = { animation: 'fade', animationDuration: duration.base } as const;

  return {
    push: reduced
      ? fade
      : ({ animation: 'ios_from_right', animationDuration: duration.slow } as const),
    modal: reduced
      ? fade
      : ({ animation: 'slide_from_bottom', animationDuration: duration.slow } as const),
    game: reduced
      ? fade
      : ({ animation: 'fade_from_bottom', animationDuration: duration.slow } as const),
    gameStep: fade,
    tabs: { animation: reduced ? 'none' : 'fade' } as const,
  };
}
