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
  const [activityLevel, setActivityLevel] =
    useState<NivelActividad>('sedentary');

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
    <div className="app-shell onboarding">

      <header className="onboarding-brand">
        <h1 className="app-title">CaloriasForDummies</h1>
      </header>

      <main className="onboarding-card">

        <div className="onboarding-progress">
          <div className="onboarding-progress-bar" />
        </div>

        <div className="onboarding-content">

          <div className="onboarding-header">
            <h2>Contanos sobre vos</h2>

            <p>
              Usaremos estos datos para calcular aproximadamente
              tus calorías diarias de mantenimiento.
            </p>
          </div>

          <div className="onboarding-form">

            <div className="onboarding-section">
              <label htmlFor="weight" className="onboarding-question">
                ¿Cuánto pesas?
              </label>

              <p className="onboarding-help">
                Podrás actualizar este dato más adelante.
              </p>

              <div className="input-with-unit">
                <input
                  id="weight"
                  type="number"
                  min="1"
                  step="0.1"
                  placeholder="Peso actual"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                />

                <span>kg</span>
              </div>
            </div>

            <div className="onboarding-section">
              <label htmlFor="height" className="onboarding-question">
                ¿Cuánto mides?
              </label>

              <div className="input-with-unit">
                <input
                  id="height"
                  type="number"
                  min="1"
                  placeholder="Altura"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                />

                <span>cm</span>
              </div>
            </div>

            <div className="onboarding-section">
              <label htmlFor="age" className="onboarding-question">
                ¿Cuál es tu edad?
              </label>

              <div className="input-with-unit">
                <input
                  id="age"
                  type="number"
                  min="1"
                  placeholder="Edad"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />

                <span>años</span>
              </div>
            </div>

            <div className="onboarding-section">
              <label htmlFor="sex" className="onboarding-question">
                Sexo
              </label>

              <select
                id="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value as Sexo)}
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>

            <div className="onboarding-section">
              <label htmlFor="activity" className="onboarding-question">
                ¿Cuál es tu nivel de actividad?
              </label>

              <p className="onboarding-help">
                Elegí la opción que mejor represente tu actividad habitual.
              </p>

              <select
                id="activity"
                value={activityLevel}
                onChange={(e) =>
                  setActivityLevel(e.target.value as NivelActividad)
                }
              >
                <option value="sedentary">
                  Sedentario (poco o nada de ejercicio)
                </option>

                <option value="light">
                  Actividad ligera (1-3 días/semana)
                </option>

                <option value="moderate">
                  Actividad moderada (3-5 días/semana)
                </option>

                <option value="active">
                  Activo (6-7 días/semana)
                </option>

                <option value="veryActive">
                  Muy activo (trabajo físico o 2x/día)
                </option>
              </select>
            </div>

            <button
              className="btn btn-primary onboarding-submit"
              onClick={handleSubmit}
            >
              Calcular mis calorías
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Onboarding;