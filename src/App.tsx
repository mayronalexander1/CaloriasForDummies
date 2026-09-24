import { useState, useEffect } from 'react';
import type { UserProfile } from './types';
import Onboarding from './components/onboarding/Onboarding';
import ListMeals from './components/meals/ListMeals';
import './App.css';
import { calcularCaloriasMantenimiento } from './helpers/perfil';

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    //const saved = localStorage.getItem('userProfile');
    //return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (profile) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  }, [profile]);

  if (!profile) {
    return <Onboarding onComplete={setProfile} />;
  }

  const metaCalorica = calcularCaloriasMantenimiento(profile);

  return <ListMeals metaCalorica={metaCalorica} />;
}

export default App;