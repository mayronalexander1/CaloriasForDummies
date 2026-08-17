
function createNewMeal(existingMeals: Meal[]): Meal {
    const id = Date.now();
    const order = existingMeals.length + 1;
    const name = `Comida ${order}`


    return {
        id,
        name,
        order,
        foods: [],
    }
}