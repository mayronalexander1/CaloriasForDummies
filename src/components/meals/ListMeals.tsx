import { useState } from 'react';
import type { Meal, AlimentoData } from '../../types';
import alimentosData from '../../data/DataBase.json';
import { calcularAlimento, calcularTotalCalorias } from '../../helpers/alimentos';

const alimentos: AlimentoData[] = alimentosData;

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
    const value = parseInt(e.target.value, 10);
    setSelectedFoodId(value);
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
      meal.id === selectedMealId
        ? { ...meal, menu: [...meal.menu, foodItem] }
        : meal
    );

    setMeals(updatedMeals);
  };

  return (
    <div>
      <h2>Comidas</h2>
      <button onClick={addMeal} disabled={meals.length >= 7}>
        Add New Meal
      </button>

      <hr />

      <h3>Agregar alimento a una comida</h3>

      <select onChange={handleMealChange} defaultValue="">
        <option value="" disabled>Elegí una comida</option>
        {meals.map((meal) => (
          <option key={meal.id} value={meal.id}>
            {meal.name}
          </option>
        ))}
      </select>

      <select onChange={handleFoodChange} defaultValue="">
        <option value="" disabled>Elegí un alimento</option>
        {alimentos.map((alimento) => (
          <option key={alimento.id} value={alimento.id}>
            {alimento.nombre}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={cantidadG}
        onChange={handleCantidadChange}
        placeholder="Cantidad en gramos"
      />

      <button onClick={addFoodToMeal}>Agregar alimento</button>

      <hr />

      <ul>
        {meals.map((meal: Meal) => (
          <li key={meal.id}>
            <strong>{meal.order} - {meal.name}</strong> — Total: {calcularTotalCalorias(meal.menu)} kcal
            <ul>
              {meal.menu.map((item, index) => (
                <li key={index}>
                  {item.nombre} ({item.cantidad_g}g) — {item.calorias} kcal
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListMeals;