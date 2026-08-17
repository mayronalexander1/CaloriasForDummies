// src/components/meals/ListMeals.tsx
import { useState } from 'react';
import type { Meal } from '../../types';

function ListMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);

  const addMeal = (): void => {
    const order = meals.length + 1;
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      order: order,
      name: `Comida ${order}`,
      menu: [],
    };
    setMeals([...meals, newMeal]);
  };

  return (
    <div>
      <button onClick={addMeal}>Add New Meal</button>
      <ul>
        {meals.map((meal: Meal) => (
          <li key={meal.id}>
            {meal.order} - {meal.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListMeals;