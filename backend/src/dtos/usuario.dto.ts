export interface CrearUsuarioDto {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  rol: string;
}

export interface ActualizarUsuarioDto {
  nombre?: string;
  apellidos?: string;
  email?: string;
  rol?: string;
}