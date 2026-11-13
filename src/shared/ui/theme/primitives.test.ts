import { describe, expect, it } from '@jest/globals';
import { duration, radius, space, typeScale } from './primitives';

describe('primitivos', () => {
  it('el espaciado es múltiplo de 4', () => {
    for (const value of Object.values(space)) expect(value % 4).toBe(0);
  });

  it('la pregunta va de 28 a 40 pt con interlineado holgado', () => {
    for (const style of [typeScale.questionS, typeScale.questionM, typeScale.questionL]) {
      expect(style.fontSize).toBeGreaterThanOrEqual(28);
      expect(style.fontSize).toBeLessThanOrEqual(40);
      expect(style.lineHeight / style.fontSize).toBeGreaterThanOrEqual(1.2);
    }
  });

  it('el texto de interfaz nunca baja de 13 pt', () => {
    for (const style of Object.values(typeScale)) expect(style.fontSize).toBeGreaterThanOrEqual(13);
  });

  it('las duraciones de movimiento caen en 180–240 ms (salvo la instantánea)', () => {
    const { instant, ...motion } = duration;
    expect(instant).toBeLessThan(180);
    for (const value of Object.values(motion)) {
      expect(value).toBeGreaterThanOrEqual(180);
      expect(value).toBeLessThanOrEqual(240);
    }
  });

  it('los radios crecen de menor a mayor', () => {
    const values = Object.values(radius);
    expect([...values].sort((a, b) => a - b)).toEqual(values);
  });
});
