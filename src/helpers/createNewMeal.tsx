import { useState } from 'react';
import { Meal, AlimentoData } from '../types/index';
import alimentosData from '../data/DataBase.json';

const alimentos: AlimentoData[] = alimentosData;

function ListMeals() {
    const [meals, setMeals] = useState<Array<Meal>>([]);
    const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);


    const addMeal = ():void => {
        const newMeal: Meal = {
            id: crypto.randomUUID(),
            order: meals.length +1,
            name: `meal${meals.length}`,
            menu:[],
        }
        setMeals([...meals, newMeal]);
    };


    return (
        <div>
            <button onClick={addMeal} disabled={meals.length >= 7}>
                Add New Meal 
            </button>
            <select onChange={handleFoodChange}>
                {alimentos.map((alimento) => (
                    <option key ={alimento.id} value={alimento.id}>
                        {alimento.nombre}
                    </option>
                ))}
            </select>
            
            <ul>
                {meals.map((meal: Meal) => (
                    <li key={meal.id}> {meal.order} - {meal.name} </li>
                ))}
            </ul>
        </div>
    );
}

export default ListMeals









