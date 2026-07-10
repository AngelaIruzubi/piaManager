export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
  activo: boolean;
}

export interface LoginResponse {
  token: string;
  rol: string;
  nombre: string;
}