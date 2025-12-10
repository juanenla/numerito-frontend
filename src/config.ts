/**
 * Configuración de la aplicación
 */

// URL base de la API del backend
// En desarrollo: backend corriendo en localhost:8080
// En producción: configurar VITE_API_BASE_URL en Vercel
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Log para debug (se elimina en producción por el build)
if (import.meta.env.DEV) {
  console.log('API_BASE_URL:', API_BASE_URL);
}
