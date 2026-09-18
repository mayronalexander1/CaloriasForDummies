import type { Meal } from '../types';

export function createNewMeal(existingMeals: Meal[]): Meal {
  const order = existingMeals.length + 1;
  return {
    id: crypto.randomUUID(),
    name: `Comida ${order}`,
    order,
    menu: [],
  };
}
