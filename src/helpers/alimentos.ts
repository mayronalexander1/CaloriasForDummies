import type { AlimentoData, MealMenu, MacroNutrientes } from '../types';

export function calcularAlimento(alimento: AlimentoData, cantidad_g: number): MealMenu {
  const factor = cantidad_g / 100;

  const calorias = Number((alimento.calorias_por_100g * factor).toFixed(1));

  const macros: MacroNutrientes = {
    proteinas: Number((alimento.macros_por_100g.proteinas * factor).toFixed(1)),
    carbohidratos: Number((alimento.macros_por_100g.carbohidratos * factor).toFixed(1)),
    grasas: Number((alimento.macros_por_100g.grasas * factor).toFixed(1)),
  };

  return {
    id_alimentos: alimento.id,
    nombre: alimento.nombre,
    cantidad_g,
    calorias,
    macros,
  };
}

export function calcularTotalCalorias(menu: MealMenu[]): number {
  return Number(menu.reduce((total, item) => total + item.calorias, 0).toFixed(1));
}