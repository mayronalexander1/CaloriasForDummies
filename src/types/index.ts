
export interface MacroNutrientes {
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface AlimentoData {
  id: number;
  nombre: string;
  calorias_por_100g: MacroNutrientes;
  macros_por_100g: MacroNutrientes
}

export interface MealMenu {
  id_alimentos: number;
  nombre: string;
  cantidad_g: number;
  calorias: number;
  macros: MacroNutrientes
}

export interface Meal {
  id: string;
  name: string;
  order: number;
  menu: MealMenu[]
}
