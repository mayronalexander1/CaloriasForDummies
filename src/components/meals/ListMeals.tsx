import { useState } from 'react';
import type { Meal, AlimentoData } from '../../types';
import alimentosData from '../../data/DataBase.json';
import { calcularAlimento, calcularTotalCalorias } from '../../helpers/alimentos';

const alimentos: AlimentoData[] = alimentosData;
const META_CALORICA = 2000; // luego lo va a definir el usuario en el onboarding

function ListMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  const [cantidadG, setCantidadG] = useState<number>(100);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  const addMeal = (): void => {
    const order = meals.length + 1;
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      order,
      name: `Comida ${order}`,
      menu: [],
    };
    setMeals([...meals, newMeal]);
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedFoodId(parseInt(e.target.value, 10));
  };

  const handleMealChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedMealId(e.target.value);
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCantidadG(parseInt(e.target.value, 10) || 0);
  };

  const addFoodToMeal = (): void => {
    if (selectedFoodId === null || selectedMealId === null) return;
    const alimento = alimentos.find((a) => a.id === selectedFoodId);
    if (!alimento) return;

    const foodItem = calcularAlimento(alimento, cantidadG);
    const updatedMeals = meals.map((meal) =>
      meal.id === selectedMealId ? { ...meal, menu: [...meal.menu, foodItem] } : meal
    );
    setMeals(updatedMeals);
  };

  const totalDiario = meals.reduce(
    (total, meal) => total + calcularTotalCalorias(meal.menu),
    0
  );
  const progreso = Math.min(100, Math.round((totalDiario / META_CALORICA) * 100));

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>CaloriasForDummies</h1>
      </header>

      <div className="card">
        <div
          className="calorie-ring"
          style={{ '--progress': progreso } as React.CSSProperties}
        >
          <div className="calorie-ring-inner">
            <strong>{Math.round(totalDiario)}</strong>
            <span>de {META_CALORICA} kcal</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={addMeal} disabled={meals.length >= 7}>
          Agregar comida
        </button>
      </div>

      <div className="card food-form">
        <h3>Agregar alimento</h3>
        <select onChange={handleMealChange} defaultValue="">
          <option value="" disabled>Elegí una comida</option>
          {meals.map((meal) => (
            <option key={meal.id} value={meal.id}>{meal.name}</option>
          ))}
        </select>

        <select onChange={handleFoodChange} defaultValue="">
          <option value="" disabled>Elegí un alimento</option>
          {alimentos.map((alimento) => (
            <option key={alimento.id} value={alimento.id}>{alimento.nombre}</option>
          ))}
        </select>

        <input
          type="number"
          value={cantidadG}
          onChange={handleCantidadChange}
          placeholder="Cantidad en gramos"
        />

        <button className="btn btn-primary" onClick={addFoodToMeal}>
          Agregar
        </button>
      </div>

      <div className="card">
        {meals.map((meal: Meal) => (
          <div key={meal.id} className="meal-card">
            <div className="meal-header">
              <h3>{meal.name}</h3>
              <span className="meal-total">{calcularTotalCalorias(meal.menu)} kcal</span>
            </div>
            {meal.menu.map((item, index) => (
              <div key={index} className="food-item">
                <span>{item.nombre} ({item.cantidad_g}g)</span>
                <span>{item.calorias} kcal</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListMeals;