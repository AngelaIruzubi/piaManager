// Configuración de desarrollo (ng serve): el backend corre aparte en el puerto 3000.
// Angular usa este archivo en lugar de environment.ts gracias a fileReplacements (angular.json).
export const environment = {
  apiUrl: 'http://localhost:3000/api',
};
