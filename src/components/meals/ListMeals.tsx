import type { Meal, AlimentoData } from '../../types';
import alimentosData from '../../data/DataBase.json';
import { calcularAlimento, calcularTotalCalorias, calcularMacrosDiarios } from '../../helpers/alimentos';
import { useState, useEffect } from 'react';
import { generateId } from '../../helpers/generatedId';
import { getTodayString } from '../../helpers/fecha';

const alimentos: AlimentoData[] = alimentosData;

interface ListMealsProps {
  metaCalorica: number;
}

function ListMeals({ metaCalorica }: ListMealsProps) {
  const [appName, setAppName] = useState<string>(() => {
    const saved = localStorage.getItem('appName');
    return saved ?? 'CaloriasForDummies';
  });

  useEffect(() => {
    localStorage.setItem('appName', appName);
  }, [appName]);

  // --- Manejo de fecha seleccionada ---
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const defaultMeals = (): Meal[] => [
    { id: generateId(), order: 1, name: 'Desayuno', menu: [] },
    { id: generateId(), order: 2, name: 'Almuerzo', menu: [] },
    { id: generateId(), order: 3, name: 'Cena', menu: [] },
  ];

  const [dailyLogs, setDailyLogs] = useState<Record<string, Meal[]>>(() => {
    const saved = localStorage.getItem('dailyLogs');
    const parsed: Record<string, Meal[]> = saved ? JSON.parse(saved) : {};

    // Migración: si había datos guardados con la versión vieja (sin fechas),
    // los movemos al día de hoy para no perderlos.
    const oldMeals = localStorage.getItem('meals');
    if (oldMeals && !parsed[getTodayString()]) {
      parsed[getTodayString()] = JSON.parse(oldMeals);
    }
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  const meals: Meal[] = dailyLogs[selectedDate] ?? defaultMeals();

  const setMeals = (updatedMeals: Meal[]): void => {
    setDailyLogs((prev) => ({ ...prev, [selectedDate]: updatedMeals }));
  };

  // --- Estado del formulario de agregar alimento ---
  const [selectedFoodId, setSelectedFoodId] = useState<number | null>(null);
  const [cantidadG, setCantidadG] = useState<string>('100');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addMeal = (): void => {
    const order = meals.length + 1;
    const newMeal: Meal = {
      id: generateId(),
      order,
      name: `Comida ${order}`,
      menu: [],
    };
    setMeals([...meals, newMeal]);
  };

  const removeMeal = (id: string): void => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const renameMeal = (id: string, newName: string): void => {
    setMeals(meals.map((meal) => (meal.id === id ? { ...meal, name: newName } : meal)));
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedFoodId(parseInt(e.target.value, 10));
  };

  const handleMealChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedMealId(e.target.value);
  };

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCantidadG(e.target.value);
  };

  const addFoodToMeal = (): void => {
    if (selectedFoodId === null || selectedMealId === null) return;
    const alimento = alimentos.find((a) => a.id === selectedFoodId);
    if (!alimento) return;

    const cantidadNum = parseInt(cantidadG, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) return;

    const foodItem = calcularAlimento(alimento, cantidadNum);
    setMeals(
      meals.map((meal) =>
        meal.id === selectedMealId ? { ...meal, menu: [...meal.menu, foodItem] } : meal
      )
    );
  };

  const removeFoodFromMeal = (mealId: string, foodIndex: number): void => {
    setMeals(
      meals.map((meal) =>
        meal.id === mealId
          ? { ...meal, menu: meal.menu.filter((_, index) => index !== foodIndex) }
          : meal
      )
    );
  };

  // --- Drag and drop ---
  const handleDragStart = (index: number): void => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number): void => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const reordered = [...meals];
    const [movedMeal] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, movedMeal);

    const withUpdatedOrder = reordered.map((meal, index) => ({
      ...meal,
      order: index + 1,
    }));

    setMeals(withUpdatedOrder);
    setDraggedIndex(null);
  };

  // --- Cálculos de calorías y macros ---
  const totalDiario = meals.reduce((total, meal) => total + calcularTotalCalorias(meal.menu), 0);
  const progreso = Math.min(100, Math.round((totalDiario / metaCalorica) * 100));

  const macrosDiarios = calcularMacrosDiarios(meals);
  const kcalCarb = macrosDiarios.carbohidratos * 4;
  const kcalProt = macrosDiarios.proteinas * 4;
  const kcalFat = macrosDiarios.grasas * 9;
  const totalMacroKcal = kcalCarb + kcalProt + kcalFat;

  const carbShare = totalMacroKcal > 0 ? kcalCarb / totalMacroKcal : 0;
  const fatShare = totalMacroKcal > 0 ? kcalFat / totalMacroKcal : 0;
  const proteinShare = totalMacroKcal > 0 ? kcalProt / totalMacroKcal : 0;

  const stopCarb = progreso * carbShare;
  const stopFat = stopCarb + progreso * fatShare;
  const stopProtein = stopFat + progreso * proteinShare;

  const ringBackground = `conic-gradient(
    var(--macro-carbs) 0% ${stopCarb}%,
    var(--macro-fat) ${stopCarb}% ${stopFat}%,
    var(--macro-protein) ${stopFat}% ${stopProtein}%,
    var(--border) ${stopProtein}% 100%
  )`;

  return (
    <div className="app-shell">
      <header className="app-header">
        <input
          className="app-title-input"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
        />
      </header>

      <div className="date-nav">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button className="btn-remove-food" onClick={() => setSelectedDate(getTodayString())}>
          Hoy
        </button>
      </div>

      <div className="card macro-summary">
        <div className="macro-item">
          <span className="macro-dot dot-carb" />
          <span className="macro-label">Carbos</span>
          <strong>{macrosDiarios.carbohidratos.toFixed(1)}g</strong>
        </div>
        <div className="macro-item">
          <span className="macro-dot dot-fat" />
          <span className="macro-label">Grasas</span>
          <strong>{macrosDiarios.grasas.toFixed(1)}g</strong>
        </div>
        <div className="macro-item">
          <span className="macro-dot dot-protein" />
          <span className="macro-label">Proteínas</span>
          <strong>{macrosDiarios.proteinas.toFixed(1)}g</strong>
        </div>
      </div>

      <div className="card">
        <div className="calorie-ring" style={{ background: ringBackground }}>
          <div className="calorie-ring-inner">
            <strong>{Math.round(totalDiario)}</strong>
            <span>de {metaCalorica} kcal</span>
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

        <button className="btn btn-accent" onClick={addFoodToMeal}>
          Agregar
        </button>
      </div>

      <div className="card">
        {meals.map((meal, index) => (
          <div
            key={meal.id}
            className="meal-card"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            <div className="meal-header">
              <span className="drag-handle">⋮⋮</span>
              <input
                className="meal-name-input"
                value={meal.name}
                onChange={(e) => renameMeal(meal.id, e.target.value)}
              />
              <span className="meal-total">{calcularTotalCalorias(meal.menu)} kcal</span>
              <button className="btn-remove-food" onClick={() => removeMeal(meal.id)}>
                ×
              </button>
            </div>

            {meal.menu.map((item, foodIndex) => (
              <div key={foodIndex} className="food-item">
                <span className="food-item-info">
                  <span>{item.nombre} ({item.cantidad_g}g)</span>
                  <span>{item.calorias} kcal</span>
                </span>
                <button
                  className="btn-remove-food"
                  onClick={() => removeFoodFromMeal(meal.id, foodIndex)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListMeals;