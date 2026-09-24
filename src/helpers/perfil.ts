import type { UserProfile, NivelActividad } from '../types';

const ACTIVITY_MULTIPLIERS: Record<NivelActividad, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export function calcularCaloriasMantenimiento(profile: UserProfile): number {
  const { weightKg, heightCm, age, sex } = profile;

  const bmr =
    sex === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  return Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel]);
}