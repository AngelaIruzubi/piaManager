export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
  activo: boolean;
  fecha_alta?: string;
  fecha_baja?: string;
}

export interface LoginResponse {
  token: string;
  rol: string;
  nombre: string;
  apellidos: string;
}