// src/helpers/generateId.ts
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para contextos no seguros (ej: acceso por IP local sin HTTPS)
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}