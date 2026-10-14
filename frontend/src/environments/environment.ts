// Configuración de producción (ng build): la API se sirve desde el mismo origen que la app,
// así que basta una ruta relativa. nginx redirige /api al backend.
export const environment = {
  apiUrl: '/api',
};
