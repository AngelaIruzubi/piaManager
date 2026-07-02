export interface RegisterDto {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  rol: 'educador' | 'coordinador';
}

export interface LoginDto {
  email: string;
  password: string;
}