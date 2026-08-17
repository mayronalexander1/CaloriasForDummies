// src/types/index.ts

export interface Meal {
  id: string;          
  name: string;         // "Comida 1" por defecto, editable por el usuario
  order: number;        // para mantener el orden si el usuario reordena
  foods: Food[];
}

export interface DailyLog {
  date: string;         
  meals: Meal[];         // máximo 7
}