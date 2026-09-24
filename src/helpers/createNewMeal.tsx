import { useState } from 'react';
import type { ChangeEvent } from 'react';

import type { Meal, AlimentoData } from '../types/index';
import alimentosData from '../data/DataBase.json';

const alimentos: AlimentoData[] = alimentosData;

function ListMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);

  const addMeal = (): void => {
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      order: meals.length + 1,
      name: `meal${meals.length + 1}`,
      menu: [],
    };

    setMeals([...meals, newMeal]);
  };

  const handleFoodChange = (
    e: ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = Number(e.target.value);

    setSelectedFoodId(value);

    console.log('Alimento seleccionado:', value);
  };

  const removeMeal = (id: string): void => {
    const mealsUpdated = meals.filter(
      (meal) => meal.id !== id
    );

    setMeals(mealsUpdated);
  };

  return (
    <div>
      <h1>Mis comidas</h1>

      <button
        onClick={addMeal}
        disabled={meals.length >= 7}
      >
        Add New Meal
      </button>

      <div>
        <label htmlFor="food">
          Seleccionar alimento:
        </label>

        <select
          id="food"
          value={selectedFoodId ?? ''}
          onChange={handleFoodChange}
        >
          <option value="">
            Seleccione un alimento
          </option>

          {alimentos.map((alimento) => (
            <option
              key={alimento.id}
              value={alimento.id}
            >
              {alimento.nombre}
            </option>
          ))}
        </select>
      </div>

      <p>
        Alimento seleccionado:{' '}
        {selectedFoodId !== null
          ? selectedFoodId
          : 'Ninguno'}
      </p>

      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            {meal.order} - {meal.name}

            <button
              onClick={() => removeMeal(meal.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListMeals;