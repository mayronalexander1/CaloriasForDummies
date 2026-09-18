import { useState } from 'react';
import { Meal, AlimentoData } from '../types/index';
import alimentosData from '../data/DataBase.json';

const alimentos: /* ¿qué tipo va acá? */ = alimentosData;

function ListMeals() {
    const [meals, setMeals] = useState<Array<Meal>>([])


    const addMeal = ():void => {
        const newMeal: Meal = {
            id: Date.now(),
            order: meals.length +1,
            name: `meal${meals.length}`,
            foods: food[],
        }
    };

    setMeals([...meals, newMeal]);
};


    return (
        <div>
            <button onClick={addMeal} disabled={meals.length >= 7}>
                Add New Meal 
            </button>
            <ul>
                {meals.map((meal: Meal) => (
                    <li key={meal.id}> {meal.order} - {meal.name} </li>
                ))}
            </ul>
        </div>
    );

export default ListMeals









