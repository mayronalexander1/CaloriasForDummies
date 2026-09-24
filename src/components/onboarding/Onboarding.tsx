// src/components/onboarding/Onboarding.tsx
import { useState } from 'react';
import type { UserProfile, Sexo, NivelActividad } from '../../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

function Onboarding({ onComplete }: OnboardingProps) {
  const [weightKg, setWeightKg] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<Sexo>('male');
  const [activityLevel, setActivityLevel] = useState<NivelActividad>('sedentary');

  const handleSubmit = (): void => {
    const profile: UserProfile = {
      weightKg: parseFloat(weightKg),
      heightCm: parseFloat(heightCm),
      age: parseInt(age, 10),
      sex,
      activityLevel,
    };
    onComplete(profile);
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h2>Contanos sobre vos</h2>

        <input
          type="number"
          placeholder="Peso (kg)"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
        />
        <input
          type="number"
          placeholder="Altura (cm)"
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select value={sex} onChange={(e) => setSex(e.target.value as Sexo)}>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
        </select>

        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as NivelActividad)}
        >
          <option value="sedentary">Sedentario (poco o nada de ejercicio)</option>
          <option value="light">Actividad ligera (1-3 días/semana)</option>
          <option value="moderate">Actividad moderada (3-5 días/semana)</option>
          <option value="active">Activo (6-7 días/semana)</option>
          <option value="veryActive">Muy activo (trabajo físico o 2x/día)</option>
        </select>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Calcular mis calorías
        </button>
      </div>
    </div>
  );
}

export default Onboarding;